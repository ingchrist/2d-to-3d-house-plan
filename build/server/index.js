import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts, useOutletContext, useNavigate, useParams } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useState, useEffect, useRef, useCallback } from "react";
import puter from "@heyputer/puter.js";
import { Box, UploadIcon, CheckCircle2, ImageIcon, ArrowRight, Layers, Clock, ArrowUpRight, X, Download, Share2, RefreshCcw } from "lucide-react";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  if (request.method.toUpperCase() === "HEAD") {
    return new Response(null, {
      status: responseStatusCode,
      headers: responseHeaders
    });
  }
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    let timeoutId = setTimeout(
      () => abort(),
      streamTimeout + 1e3
    );
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              timeoutId = void 0;
              callback();
            }
          });
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          pipe(body);
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const PROGRESS_INCREMENT = 15;
const REDIRECT_DELAY_MS = 600;
const PROGRESS_INTERVAL_MS = 100;
const ROOMIFY_RENDER_PROMPT = `
TASK: Convert the input 2D floor plan into a **photorealistic, top‑down 3D architectural render**.

STRICT REQUIREMENTS (do not violate):
1) **REMOVE ALL TEXT**: Do not render any letters, numbers, labels, dimensions, or annotations. Floors must be continuous where text used to be.
2) **GEOMETRY MUST MATCH**: Walls, rooms, doors, and windows must follow the exact lines and positions in the plan. Do not shift or resize.
3) **TOP‑DOWN ONLY**: Orthographic top‑down view. No perspective tilt.
4) **CLEAN, REALISTIC OUTPUT**: Crisp edges, balanced lighting, and realistic materials. No sketch/hand‑drawn look.
5) **NO EXTRA CONTENT**: Do not add rooms, furniture, or objects that are not clearly indicated by the plan.

STRUCTURE & DETAILS:
- **Walls**: Extrude precisely from the plan lines. Consistent wall height and thickness.
- **Doors**: Convert door swing arcs into open doors, aligned to the plan.
- **Windows**: Convert thin perimeter lines into realistic glass windows.

FURNITURE & ROOM MAPPING (only where icons/fixtures are clearly shown):
- Bed icon → realistic bed with duvet and pillows.
- Sofa icon → modern sectional or sofa.
- Dining table icon → table with chairs.
- Kitchen icon → counters with sink and stove.
- Bathroom icon → toilet, sink, and tub/shower.
- Office/study icon → desk, chair, and minimal shelving.
- Porch/patio/balcony icon → outdoor seating or simple furniture (keep minimal).
- Utility/laundry icon → washer/dryer and minimal cabinetry.

STYLE & LIGHTING:
- Lighting: bright, neutral daylight. High clarity and balanced contrast.
- Materials: realistic wood/tile floors, clean walls, subtle shadows.
- Finish: professional architectural visualization; no text, no watermarks, no logos.
`.trim();
const signIn = async () => await puter.auth.signIn();
const signOut = () => puter.auth.signOut();
const getCurrentUser = async () => {
  try {
    return await puter.auth.getUser();
  } catch {
    return null;
  }
};
const createProject = async ({ item, visibility = "private" }) => {
  {
    console.warn("Missing VITE_PUTER_WORKER_URL; skip history fetch;");
    return null;
  }
};
const getProjects = async () => {
  {
    console.warn("Missing VITE_PUTER_WORKER_URL; skip history fetch;");
    return [];
  }
};
const getProjectById = async ({ id }) => {
  {
    console.warn("Missing VITE_PUTER_WORKER_URL; skipping project fetch.");
    return null;
  }
};
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const DEFAULT_AUTH_STATE = {
  isSignedIn: false,
  userName: null,
  userId: null
};
const root = UNSAFE_withComponentProps(function App() {
  const [authState, setAuthState] = useState(DEFAULT_AUTH_STATE);
  const refreshAuth = async () => {
    try {
      const user = await getCurrentUser();
      setAuthState({
        isSignedIn: !!user,
        userName: user?.username || null,
        userId: user?.uuid || null
      });
      return !!user;
    } catch {
      setAuthState(DEFAULT_AUTH_STATE);
      return false;
    }
  };
  useEffect(() => {
    refreshAuth();
  }, []);
  const signIn$1 = async () => {
    await signIn();
    return await refreshAuth();
  };
  const signOut$1 = async () => {
    signOut();
    return await refreshAuth();
  };
  return /* @__PURE__ */ jsxs("main", {
    className: "min-h-screen bg-background text-foreground relative z-10",
    children: [/* @__PURE__ */ jsx(Outlet, {
      context: {
        ...authState,
        refreshAuth,
        signIn: signIn$1,
        signOut: signOut$1
      }
    }), ";"]
  });
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
const Button = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  children,
  ...props
}) => {
  const baseClass = "btn";
  const variantClass = `btn--${variant}`;
  const sizeClass = `btn--${size}`;
  const fullWidthClass = fullWidth ? "btn--full" : "";
  const combinedClasses = [
    baseClass,
    variantClass,
    sizeClass,
    fullWidthClass,
    className
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsx("button", { className: combinedClasses, ...props, children });
};
const Navbar = () => {
  const { isSignedIn, userName, signIn: signIn2, signOut: signOut2 } = useOutletContext();
  const handleAuthClick = async () => {
    if (isSignedIn) {
      try {
        await signOut2();
      } catch (e) {
        console.error(`Puter sign out failed: ${e}`);
      }
      return;
    }
    try {
      await signIn2();
    } catch (e) {
      console.error(`Puter sign in failed: ${e}`);
    }
  };
  return /* @__PURE__ */ jsx("header", { className: "navbar", children: /* @__PURE__ */ jsxs("nav", { className: "inner", children: [
    /* @__PURE__ */ jsxs("div", { className: "left", children: [
      /* @__PURE__ */ jsxs("div", { className: "brand", children: [
        /* @__PURE__ */ jsx(Box, { className: "logo" }),
        /* @__PURE__ */ jsx("span", { className: "name", children: "Roomify" })
      ] }),
      /* @__PURE__ */ jsxs("ul", { className: "links", children: [
        /* @__PURE__ */ jsx("a", { href: "#", children: "Product" }),
        /* @__PURE__ */ jsx("a", { href: "#", children: "Pricing" }),
        /* @__PURE__ */ jsx("a", { href: "#", children: "Community" }),
        /* @__PURE__ */ jsx("a", { href: "#", children: "Enterprise" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "actions", children: isSignedIn ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("span", { className: "greeting", children: userName ? `Hi, ${userName}` : "Signed in" }),
      /* @__PURE__ */ jsx(Button, { size: "sm", onClick: handleAuthClick, className: "btn", children: "Log Out" })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Button, { onClick: handleAuthClick, size: "sm", variant: "ghost", children: "Log In" }),
      /* @__PURE__ */ jsx("a", { href: "#upload", className: "cta", children: "Get Started" })
    ] }) })
  ] }) });
};
const Upload = ({ onComplete }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const { isSignedIn } = useOutletContext();
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);
  const processFile = useCallback((file2) => {
    if (!isSignedIn) return;
    setFile(file2);
    setProgress(0);
    const reader = new FileReader();
    reader.onerror = () => {
      setFile(null);
      setProgress(0);
    };
    reader.onloadend = () => {
      const base64Data = reader.result;
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          const next = prev + PROGRESS_INCREMENT;
          if (next >= 100) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            timeoutRef.current = setTimeout(() => {
              onComplete?.(base64Data);
              timeoutRef.current = null;
            }, REDIRECT_DELAY_MS);
            return 100;
          }
          return next;
        });
      }, PROGRESS_INTERVAL_MS);
    };
    reader.readAsDataURL(file2);
  }, [isSignedIn, onComplete]);
  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isSignedIn) return;
    setIsDragging(true);
  };
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (!isSignedIn) return;
    const droppedFile = e.dataTransfer.files[0];
    const allowedTypes = ["image/jpeg", "image/png"];
    if (droppedFile && allowedTypes.includes(droppedFile.type)) {
      processFile(droppedFile);
    }
  };
  const handleChange = (e) => {
    if (!isSignedIn) return;
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "upload", children: !file ? /* @__PURE__ */ jsxs(
    "div",
    {
      className: `dropzone ${isDragging ? "is-dragging" : ""}`,
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
      children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "file",
            className: "drop-input",
            accept: ".jpg,.jpeg,.png,.webp",
            disabled: !isSignedIn,
            onChange: handleChange
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "drop-content", children: [
          /* @__PURE__ */ jsx("div", { className: "drop-icon", children: /* @__PURE__ */ jsx(UploadIcon, { size: 20 }) }),
          /* @__PURE__ */ jsx("p", { children: isSignedIn ? "Click to upload or just drag and drop" : "Sign in or sign up with Puter to upload" }),
          /* @__PURE__ */ jsx("p", { className: "help", children: "Maximum file size 50 MB." })
        ] })
      ]
    }
  ) : /* @__PURE__ */ jsx("div", { className: "upload-status", children: /* @__PURE__ */ jsxs("div", { className: "status-content", children: [
    /* @__PURE__ */ jsx("div", { className: "status-icon", children: progress === 100 ? /* @__PURE__ */ jsx(CheckCircle2, { className: "check" }) : /* @__PURE__ */ jsx(ImageIcon, { className: "image" }) }),
    /* @__PURE__ */ jsx("h3", { children: file.name }),
    /* @__PURE__ */ jsxs("div", { className: "progress", children: [
      /* @__PURE__ */ jsx("div", { className: "bar", style: { width: `${progress}%` } }),
      /* @__PURE__ */ jsx("p", { className: "status-text", children: progress < 100 ? "Analyzing Floor Plan..." : "Redirecting..." })
    ] })
  ] }) }) });
};
function meta({}) {
  return [{
    title: "New React Router App"
  }, {
    name: "description",
    content: "Welcome to React Router!"
  }];
}
const home = UNSAFE_withComponentProps(function Home() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const isCreatingProjectRef = useRef(false);
  const handleUploadComplete = async (base64Image) => {
    try {
      if (isCreatingProjectRef.current) return false;
      isCreatingProjectRef.current = true;
      const newId = Date.now().toString();
      const name = `Residence ${newId}`;
      const newItem = {
        id: newId,
        name,
        sourceImage: base64Image,
        renderedImage: void 0,
        timestamp: Date.now()
      };
      const saved = await createProject({
        item: newItem,
        visibility: "private"
      });
      if (!saved) {
        console.error("Failed to create project");
        return false;
      }
      setProjects((prev) => [saved, ...prev]);
      navigate(`/visualizer/${newId}`, {
        state: {
          initialImage: saved.sourceImage,
          initialRendered: saved.renderedImage || null,
          name
        }
      });
      return true;
    } finally {
      isCreatingProjectRef.current = false;
    }
  };
  useEffect(() => {
    const fetchProjects = async () => {
      const items = await getProjects();
      setProjects(items);
    };
    fetchProjects();
  }, []);
  return /* @__PURE__ */ jsxs("div", {
    className: "home",
    children: [/* @__PURE__ */ jsx(Navbar, {}), /* @__PURE__ */ jsxs("section", {
      className: "hero",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "announce",
        children: [/* @__PURE__ */ jsx("div", {
          className: "dot",
          children: /* @__PURE__ */ jsx("div", {
            className: "pulse"
          })
        }), /* @__PURE__ */ jsx("p", {
          children: "Introducing Roomify 2.0"
        })]
      }), /* @__PURE__ */ jsx("h1", {
        children: "Build beautiful spaces at the speed of thought with Roomify"
      }), /* @__PURE__ */ jsx("p", {
        className: "subtitle",
        children: "Roomify is an AI-first design environment that helps you visualize, render, and ship architectural projects faster  than ever."
      }), /* @__PURE__ */ jsxs("div", {
        className: "actions",
        children: [/* @__PURE__ */ jsxs("a", {
          href: "#upload",
          className: "cta",
          children: ["Start Building ", /* @__PURE__ */ jsx(ArrowRight, {
            className: "icon"
          })]
        }), /* @__PURE__ */ jsx(Button, {
          variant: "outline",
          size: "lg",
          className: "demo",
          children: "Watch Demo"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        id: "upload",
        className: "upload-shell",
        children: [/* @__PURE__ */ jsx("div", {
          className: "grid-overlay"
        }), /* @__PURE__ */ jsxs("div", {
          className: "upload-card",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "upload-head",
            children: [/* @__PURE__ */ jsx("div", {
              className: "upload-icon",
              children: /* @__PURE__ */ jsx(Layers, {
                className: "icon"
              })
            }), /* @__PURE__ */ jsx("h3", {
              children: "Upload your floor plan"
            }), /* @__PURE__ */ jsx("p", {
              children: "Supports JPG, PNG, formats up to 10MB"
            })]
          }), /* @__PURE__ */ jsx(Upload, {
            onComplete: handleUploadComplete
          })]
        })]
      })]
    }), /* @__PURE__ */ jsx("section", {
      className: "projects",
      children: /* @__PURE__ */ jsxs("div", {
        className: "section-inner",
        children: [/* @__PURE__ */ jsx("div", {
          className: "section-head",
          children: /* @__PURE__ */ jsxs("div", {
            className: "copy",
            children: [/* @__PURE__ */ jsx("h2", {
              children: "Projects"
            }), /* @__PURE__ */ jsx("p", {
              children: "Your latest work and shared community projects, all in one place."
            })]
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "projects-grid",
          children: projects.map(({
            id,
            name,
            renderedImage,
            sourceImage,
            timestamp
          }) => /* @__PURE__ */ jsxs("div", {
            className: "project-card group",
            onClick: () => navigate(`/visualizer/${id}`),
            children: [/* @__PURE__ */ jsxs("div", {
              className: "preview",
              children: [/* @__PURE__ */ jsx("img", {
                src: renderedImage || sourceImage,
                alt: "Project"
              }), /* @__PURE__ */ jsx("div", {
                className: "badge",
                children: /* @__PURE__ */ jsx("span", {
                  children: "Community"
                })
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "card-body",
              children: [/* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("h3", {
                  children: name
                }), /* @__PURE__ */ jsxs("div", {
                  className: "meta",
                  children: [/* @__PURE__ */ jsx(Clock, {
                    size: 12
                  }), /* @__PURE__ */ jsx("span", {
                    children: new Date(timestamp).toLocaleDateString()
                  }), /* @__PURE__ */ jsx("span", {
                    children: "By JS Mastery"
                  })]
                })]
              }), /* @__PURE__ */ jsx("div", {
                className: "arrow",
                children: /* @__PURE__ */ jsx(ArrowUpRight, {
                  size: 18
                })
              })]
            })]
          }, id))
        })]
      })
    })]
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const fetchAsDataUrl = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
const generate3DView = async ({ sourceImage }) => {
  const dataUrl = sourceImage.startsWith("data:") ? sourceImage : await fetchAsDataUrl(sourceImage);
  const base64Data = dataUrl.split(",")[1];
  const mimeType = dataUrl.split(";")[0].split(":")[1];
  if (!mimeType || !base64Data) throw new Error("Invalid source image payload");
  const response = await puter.ai.txt2img(ROOMIFY_RENDER_PROMPT, {
    provider: "gemini",
    model: "gemini-2.5-flash-image-preview",
    input_image: base64Data,
    input_image_mime_type: mimeType,
    ratio: { w: 1024, h: 1024 }
  });
  const rawImageUrl = response.src ?? null;
  if (!rawImageUrl) return { renderedImage: null, renderedPath: void 0 };
  const renderedImage = rawImageUrl.startsWith("data:") ? rawImageUrl : await fetchAsDataUrl(rawImageUrl);
  return { renderedImage, renderedPath: void 0 };
};
const VisualizerId = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const {
    userId
  } = useOutletContext();
  const hasInitialGenerated = useRef(false);
  const [project, setProject] = useState(null);
  const [isProjectLoading, setIsProjectLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const handleBack = () => navigate("/");
  const handleExport = () => {
    if (!currentImage) return;
    const link = document.createElement("a");
    link.href = currentImage;
    link.download = `roomify-${id || "design"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const runGeneration = async (item) => {
    if (!id || !item.sourceImage) return;
    try {
      setIsProcessing(true);
      const result = await generate3DView({
        sourceImage: item.sourceImage
      });
      if (result.renderedImage) {
        setCurrentImage(result.renderedImage);
        const updatedItem = {
          ...item,
          renderedImage: result.renderedImage,
          renderedPath: result.renderedPath,
          timestamp: Date.now(),
          ownerId: item.ownerId ?? userId ?? null,
          isPublic: item.isPublic ?? false
        };
        const saved = await createProject({
          item: updatedItem,
          visibility: "private"
        });
        if (saved) {
          setProject(saved);
          setCurrentImage(saved.renderedImage || result.renderedImage);
        }
      }
    } catch (error) {
      console.error("Generation failed: ", error);
    } finally {
      setIsProcessing(false);
    }
  };
  useEffect(() => {
    let isMounted = true;
    const loadProject = async () => {
      if (!id) {
        setIsProjectLoading(false);
        return;
      }
      setIsProjectLoading(true);
      const fetchedProject = await getProjectById({
        id
      });
      if (!isMounted) return;
      setProject(fetchedProject);
      setCurrentImage(fetchedProject?.renderedImage || null);
      setIsProjectLoading(false);
      hasInitialGenerated.current = false;
    };
    loadProject();
    return () => {
      isMounted = false;
    };
  }, [id]);
  useEffect(() => {
    if (isProjectLoading || hasInitialGenerated.current || !project?.sourceImage) return;
    if (project.renderedImage) {
      setCurrentImage(project.renderedImage);
      hasInitialGenerated.current = true;
      return;
    }
    hasInitialGenerated.current = true;
    void runGeneration(project);
  }, [project, isProjectLoading]);
  return /* @__PURE__ */ jsxs("div", {
    className: "visualizer",
    children: [/* @__PURE__ */ jsxs("nav", {
      className: "topbar",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "brand",
        children: [/* @__PURE__ */ jsx(Box, {
          className: "logo"
        }), /* @__PURE__ */ jsx("span", {
          className: "name",
          children: "Roomify"
        })]
      }), /* @__PURE__ */ jsxs(Button, {
        variant: "ghost",
        size: "sm",
        onClick: handleBack,
        className: "exit",
        children: [/* @__PURE__ */ jsx(X, {
          className: "icon"
        }), " Exit Editor"]
      })]
    }), /* @__PURE__ */ jsxs("section", {
      className: "content",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "panel",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "panel-header",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "panel-meta",
            children: [/* @__PURE__ */ jsx("p", {
              children: "Project"
            }), /* @__PURE__ */ jsx("h2", {
              children: project?.name || `Residence ${id}`
            }), /* @__PURE__ */ jsx("p", {
              className: "note",
              children: "Created by You"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "panel-actions",
            children: [/* @__PURE__ */ jsxs(Button, {
              size: "sm",
              onClick: handleExport,
              className: "export",
              disabled: !currentImage,
              children: [/* @__PURE__ */ jsx(Download, {
                className: "w-4 h-4 mr-2"
              }), " Export"]
            }), /* @__PURE__ */ jsxs(Button, {
              size: "sm",
              onClick: () => {
              },
              className: "share",
              children: [/* @__PURE__ */ jsx(Share2, {
                className: "w-4 h-4 mr-2"
              }), "Share"]
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: `render-area ${isProcessing ? "is-processing" : ""}`,
          children: [currentImage ? /* @__PURE__ */ jsx("img", {
            src: currentImage,
            alt: "AI Render",
            className: "render-img"
          }) : /* @__PURE__ */ jsx("div", {
            className: "render-placeholder",
            children: project?.sourceImage && /* @__PURE__ */ jsx("img", {
              src: project?.sourceImage,
              alt: "Original",
              className: "render-fallback"
            })
          }), isProcessing && /* @__PURE__ */ jsx("div", {
            className: "render-overlay",
            children: /* @__PURE__ */ jsxs("div", {
              className: "rendering-card",
              children: [/* @__PURE__ */ jsx(RefreshCcw, {
                className: "spinner"
              }), /* @__PURE__ */ jsx("span", {
                className: "title",
                children: "Rendering..."
              }), /* @__PURE__ */ jsx("span", {
                className: "subtitle",
                children: "Generating your 3D visualization"
              })]
            })
          })]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "panel compare",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "panel-header",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "panel-meta",
            children: [/* @__PURE__ */ jsx("p", {
              children: "Comparison"
            }), /* @__PURE__ */ jsx("h3", {
              children: "Before and After"
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "hint",
            children: "Drag to compare"
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "compare-stage",
          children: project?.sourceImage && currentImage ? /* @__PURE__ */ jsx(ReactCompareSlider, {
            defaultValue: 50,
            style: {
              width: "100%",
              height: "auto"
            },
            itemOne: /* @__PURE__ */ jsx(ReactCompareSliderImage, {
              src: project?.sourceImage,
              alt: "before",
              className: "compare-img"
            }),
            itemTwo: /* @__PURE__ */ jsx(ReactCompareSliderImage, {
              src: currentImage || project?.renderedImage,
              alt: "after",
              className: "compare-img"
            })
          }) : /* @__PURE__ */ jsx("div", {
            className: "compare-fallback",
            children: project?.sourceImage && /* @__PURE__ */ jsx("img", {
              src: project.sourceImage,
              alt: "Before",
              className: "compare-img"
            })
          })
        })]
      })]
    })]
  });
};
const visualizer_$id = UNSAFE_withComponentProps(VisualizerId);
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: visualizer_$id
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-BSXq60LJ.js", "imports": ["/assets/chunk-EPOLDU6W-gOTICZEU.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-D9x6RFV9.js", "imports": ["/assets/chunk-EPOLDU6W-gOTICZEU.js", "/assets/puter.action-BNK78kSz.js"], "css": ["/assets/root-BHEHAZfK.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-DWIJwSPM.js", "imports": ["/assets/chunk-EPOLDU6W-gOTICZEU.js", "/assets/Button-B32zISfh.js", "/assets/puter.action-BNK78kSz.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/visualizer.$id": { "id": "routes/visualizer.$id", "parentId": "root", "path": "visualizer/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/visualizer._id-yqPB6t6Y.js", "imports": ["/assets/chunk-EPOLDU6W-gOTICZEU.js", "/assets/puter.action-BNK78kSz.js", "/assets/Button-B32zISfh.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-95bad7d0.js", "version": "95bad7d0", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "unstable_optimizeDeps": false, "unstable_subResourceIntegrity": false, "unstable_trailingSlashAwareDataRequests": false, "v8_middleware": false, "v8_splitRouteModules": false, "v8_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/visualizer.$id": {
    id: "routes/visualizer.$id",
    parentId: "root",
    path: "visualizer/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  }
};
const allowedActionOrigins = false;
export {
  allowedActionOrigins,
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
