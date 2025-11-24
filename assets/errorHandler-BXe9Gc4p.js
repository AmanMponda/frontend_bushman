const n=o=>{const s=[];if(console.log(o),o){const{status:c,data:e}=o;if(console.log(c),e&&typeof e=="object")for(const t in e)s.push(`${t.replace(/_/g," ")}: ${e[t]}`);else s.push("Unexpected server response format.")}return s};export{n as h};
//# sourceMappingURL=errorHandler-BXe9Gc4p.js.map
