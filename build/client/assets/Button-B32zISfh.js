import{a as r,p as m}from"./chunk-EPOLDU6W-gOTICZEU.js";const y=15,A=600,N=100,O=`
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
`.trim();const p=(...e)=>e.filter((t,o,s)=>!!t&&t.trim()!==""&&s.indexOf(t)===o).join(" ").trim();const w=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();const C=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(t,o,s)=>s?s.toUpperCase():o.toLowerCase());const u=e=>{const t=C(e);return t.charAt(0).toUpperCase()+t.slice(1)};var b={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};const E=e=>{for(const t in e)if(t.startsWith("aria-")||t==="role"||t==="title")return!0;return!1};const f=r.forwardRef(({color:e="currentColor",size:t=24,strokeWidth:o=2,absoluteStrokeWidth:s,className:n="",children:a,iconNode:d,...i},l)=>r.createElement("svg",{ref:l,...b,width:t,height:t,stroke:e,strokeWidth:s?Number(o)*24/Number(t):o,className:p("lucide",n),...!a&&!E(i)&&{"aria-hidden":"true"},...i},[...d.map(([h,c])=>r.createElement(h,c)),...Array.isArray(a)?a:[a]]));const R=(e,t)=>{const o=r.forwardRef(({className:s,...n},a)=>r.createElement(f,{ref:a,iconNode:t,className:p(`lucide-${w(u(e))}`,`lucide-${e}`,s),...n}));return o.displayName=u(e),o};const g=[["path",{d:"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",key:"hh9hay"}],["path",{d:"m3.3 7 8.7 5 8.7-5",key:"g66t2b"}],["path",{d:"M12 22V12",key:"d0xqtd"}]],k=R("box",g),v=({variant:e="primary",size:t="md",fullWidth:o=!1,className:s="",children:n,...a})=>{const i=`btn--${e}`,l=`btn--${t}`,c=["btn",i,l,o?"btn--full":"",s].filter(Boolean).join(" ");return m.jsx("button",{className:c,...a,children:n})};export{k as B,N as P,A as R,v as a,y as b,R as c,O as d};
