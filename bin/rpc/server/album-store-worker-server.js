"use strict";(()=>{var p=class o{static async getFromCache(e,r){let t=[];if(!caches)return t;let n=await caches.open(e);for(let a=0;a<r.length;a++){let s=await n.match(r[a]);t.push(s)}return t}static async isInCache(e,r,t){let n=[];if(!caches)return n;let a=await o.getFromCache(e,r);for(let s=0;s<r.length;s++){let i=!!a[s]?.ok;!i&&t&&(i=t(a[s],r[s])),n.push(i)}return n}static async addCachedUrls(e,r){let t=[];if(!caches)return t;let n=await caches.open(e);for(let a=0;a<r.length;a++){let s=!1;try{r[a]&&(await n.add(r[a]),s=!0)}catch{}t.push(s)}return t}static async deleteCachedUrls(e,r,t){let n=[];if(!caches)return n;let a=await caches.open(e);for(let s=0;s<r.length;s++){let i=await a.delete(r[s],t);n.push(i)}return n}};var h="dhamma-initiative.github.io",P=`https://${h}`;var c=class{static queryTrackTextUrl(e){return`${P}/${e}.txt`}static queryTrackHtmlAudioSrcRef(e){return`${P}/${e}.wav.mp3`}static parseTrackRefElements(e){let r=e.replace(/^.*[\\\/]/,""),t=e.substring(0,e.length-r.length);return t.startsWith("/")&&(t=t.substring(1)),t.endsWith("/")&&(t=t.substring(0,t.length-1)),[t,r]}static jsonToQueryString(e,r){let t=new URLSearchParams;return Object.getOwnPropertyNames(e).forEach((s,i,d)=>{e[s]!==void 0&&(!r||r&&r[s]!==e[s])&&t.set(s,e[s])}),t.toString().replaceAll("%2C",",")}static getSearchParamValueAsFloat(e,r){let t=parseFloat(e);return isNaN(t)?r:t}};var g=class{static async isAudioInCache(e){let r=c.queryTrackHtmlAudioSrcRef(e);return await p.isInCache(h,[r],(n,a)=>n?.type==="opaque"&&n?.url==="")}static async addAudioToCache(e){let r=c.queryTrackHtmlAudioSrcRef(e);return await p.addCachedUrls(h,[r])}static async removeAudioFromCache(e){let r=c.queryTrackHtmlAudioSrcRef(e);return await p.deleteCachedUrls(h,[r])}};var f=class{static forEach(e,r,t){let n="",a=!1,s="";for(let i=0;i<e.length;i++){let d=e.charAt(i),u=r.includes(i);a===u?s+=d:(n+=t(s,a),s=d),a=u}return s&&(n+=t(s,a)),n}},R=class{selections;constructor(e){this.selections=new Set(e)}toggle(e){let r=this.selections.has(e);return r?this.selections.delete(e):this.selections.add(e),!r}toString(){if(this.selections.size===0)return"";let e=Array.from(this.selections).sort((s,i)=>s-i),r=[],t=[e[0]];function n(){t.length===1?r.push(`${t[0]}`):t.length>1&&r.push(`${t[0]}-${t[t.length-1]}`)}for(let s=1;s<e.length;s++)e[s-1]+1===e[s]?t.push(e[s]):(n(),t=[e[s]]);return n(),r.join(",")}toNumbers(){let e=Array.from(this.selections);return e.sort(),this.selections=new Set(e),e}fromString(e){this.selections.clear();let r=e.split(",");for(let t=0;t<r.length;t++)if(r[t]){let n=r[t].split("-"),a=[];for(let s=0;s<n.length;s++)a.push(parseInt(n[s]));if(a.length===1)this.selections.add(a[0]);else for(let s=a[0];s<a[1]+1;s++)this.selections.add(s)}return this}fromNumbers(e){let r=[];return e.forEach((t,n,a)=>{let s=String(t);s=s.replace(",","-"),r.push(s)}),this.fromString(r.toString())}};var b=class o{static markupContent(e,r,t){return r&&(e=o._markupHeaders(e)),t&&(e=this._markupTextRanges(e,t)),e}static _markupHeaders(e){let r=e.indexOf(`
`),t=e.substring(0,r);t="# "+t;let n=e.indexOf(`
`,r+1),a=e.substring(r+1,n).trim();a.length>0&&(a="## "+a);let s=e.substring(n+1);return e=`${t}
${a}
${s}`,e}static _markupTextRanges(e,r){let t=new R;return t.fromString(r),t.selections.size>0&&(e=f.forEach(e,t.toNumbers(),(n,a)=>a?`==${n}==`:n)),e}};var m=class{static defer(){let e,r,t=new Promise((a,s)=>{e=a,r=s}),n=t;return n.resolve=e,n.reject=r,t}};var l=class o{static THREAD_TYPES=["Window","DedicatedWorkerGlobalScope","ServiceWorkerGlobalScope","SharedWorkerGlobalScope"];static THREAD_TYPE=self.constructor.name;static THREAD_TYPE_IDX=o.THREAD_TYPES.indexOf(o.THREAD_TYPE);static THREAD_ID;static IS_MOBILE_PLATFORM;static _debounceTimer;static deepClone(e){if(e===null||typeof e!="object")return e;if(Array.isArray(e))return e.map(t=>o.deepClone(t));let r={};for(let t in e)e.hasOwnProperty(t)&&(r[t]=o.deepClone(e[t]));return r}static debounce(e,r){clearTimeout(o._debounceTimer),o._debounceTimer=setTimeout(e,r)}static _setIsMobilePlatform(){if(o.IS_MOBILE_PLATFORM!==void 0)return;let e=navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i),r="ontouchstart"in(o.THREAD_TYPE_IDX===0?window:self),t="accelerometer"in(o.THREAD_TYPE_IDX===0?window:self);o.IS_MOBILE_PLATFORM=!!(e||r||t),console.log(`Thread#[${o.THREAD_TYPE_IDX}].IS_MOBILE=${o.IS_MOBILE_PLATFORM}`)}static _setThreadId(){if(o.THREAD_TYPE_IDX===0)o.THREAD_ID=o.THREAD_TYPE;else if(o.THREAD_TYPE_IDX===2){let e="/indeterminant-scriptURL";"serviceWorker"in self&&"scriptURL"in self.serviceWorker&&(e=self.serviceWorker.scriptURL),o.THREAD_ID=`sw${e.substring(e.lastIndexOf("/"))}`}else if(o.THREAD_ID=self.name,!o.THREAD_ID)throw new Error("IllegalState: All web workers & shared workers must be named via the constructor!")}static{o._setThreadId(),o._setIsMobilePlatform()}};var _=class o{static _resolvedPromise=Promise.resolve(void 0);static _promiseHashMap=new Map;api=NaN;_rpcIdxFuncMap=new Map;_rpcFuncIdxMap=new Map;_orderedTransferredPortMaps=[];_namedTransferredPortMaps=new Map;bindRpcFunc(e,r,t){let n=this._rpcIdxFuncMap.size;this._rpcIdxFuncMap.set(n,{thisArg:e,run:r,...t}),this._rpcFuncIdxMap.set(r,n)}_prepareMessage(e,r){let t={headers:{request:{id:l.THREAD_ID,context:this.__getName__(),portId:"<required>"}},api:this.api,rpc:this._rpcFuncIdxMap.get(e)};if(Number.isNaN(t.api)||t.rpc===void 0)throw new Error(`IllegalArgument: [${JSON.stringify(t)}]; indeterminate API/RPC target!`);let n=this._rpcIdxFuncMap.get(t.rpc);if(!n.hasNoArgs){if(r===void 0)throw new Error(`IllegalArgument: [${JSON.stringify(t)}] requires argument to be set before post!`);t.args=r}return n.hasReturn&&(t.returnPromise=!0),t}_bindMethods(e=!0){this._rpcIdxFuncMap.clear(),this._rpcFuncIdxMap.clear(),e&&this._bindSystemFuncs()}_bindSystemFuncs(){this.bindRpcFunc(this,this.__teardown__,{hasNoArgs:!0}),this.bindRpcFunc(this,this.__transferPorts__,{hasReturn:!0,hasServerTransferredPorts:!0}),this.bindRpcFunc(this,this.__getTransferredPorts__,{hasReturn:!0}),this.bindRpcFunc(this,this.__deleteTransferredPorts__)}async _handleRpc(e){if(e.data?.api!==this.api||e.data?.rpc===void 0||this._returnRpcResultIfResolved(e))return;this._registerTransferredPorts(e);let r=this._rpcIdxFuncMap.get(e.data.rpc);if(e.rpcInvoked=r,r)await this._invokeRpcMethod(e);else throw new Error(`IllegalArgument: rpc[${e.data.rpc}] not supported on Context[${this.__getName__()}]`)}_returnRpcResultIfResolved(e){let r=!1,t=e.data.promiseHash;if(t){let n=o._promiseHashMap.get(t);if(n)e.data.promiseHash=void 0,o._promiseHashMap.delete(t),n.resolve(e.data),r=!0;else if(e.data.resp)throw new Error(`IllegalState: ${l.THREAD_ID} received misdirected promiseHash[${t}]`)}return r}_registerTransferredPorts(e){for(let r=0;r<e.ports.length;r++)this._orderedTransferredPortMaps.push(e.ports[r]),e.ports[r].onmessage=async t=>{await this._onMessageChannelMessage(t)},e.ports[r].rpcPortId="altWorkerMC"}_unregisterTransferredPort(e){let r=this._orderedTransferredPortMaps.indexOf(e);r>-1&&(e.close(),e.onmessage=null,this._orderedTransferredPortMaps.splice(r,1))}async _invokeRpcMethod(e){let r=e.rpcInvoked,t=e.target||self,n=r.hasClientPromiseAwait?m.defer():void 0,a=[];r.hasNoArgs||a.push(e.data.args),r.hasClientPromiseAwait&&a.push(n),r.hasServerTransferredPorts&&a.push(e.ports),r.hasMessageEvent&&a.push(e),a.push(t);let s;if(r.thisArg?(r.runBound===void 0&&(r.runBound=r.run.bind(r.thisArg)),s=await r.runBound(...a)):s=await r.run(...a),n&&(s=await n),r.hasReturn){let i={...e.data,resp:s};i.headers.response={id:l.THREAD_ID,context:this.__getName__(),portId:t.rpcPortId},t.postMessage(i)}}_postMessage(e,r,t){let n=this._preparePostMessageReturnPromise(r);return t=this._preparePostMessageOptions(t),r.headers.request.portId=e.rpcPortId,e.postMessage(r,t),this._alertMessageDispatched(),n}_preparePostMessageReturnPromise(e){let r=o._resolvedPromise;return e.returnPromise&&(e.promiseHash=crypto.randomUUID(),e.returnPromise=void 0,r=m.defer(),o._promiseHashMap.set(e.promiseHash,r)),r}_preparePostMessageOptions(e){return e}_alertMessageDispatched(){}};var k=class extends _{_multiWorkerHandler;async __teardown__(){let e=arguments[0];if(e instanceof MessagePort&&this._unregisterTransferredPort(e),l.THREAD_TYPE_IDX===1&&"close"in e){let r=e;r.onmessage=null,r.close()}}async __transferPorts__(e,r){let t=r.length-e.portIds.length,n=0;for(let a=0;a<r.length;a++){let s=r[a];a>=t&&(this._namedTransferredPortMaps.set(e.portIds[a-t],s),s.rpcPortId=e.portIds[a-t]),n++}return{count:n}}async __getTransferredPorts__(){return{portIds:Array.from(this._namedTransferredPortMaps.keys())}}async __deleteTransferredPorts__(e){e.portIds.forEach((r,t,n)=>{let a=this._namedTransferredPortMaps.get(r);this._unregisterTransferredPort(a),this._namedTransferredPortMaps.delete(r)})}startServer(e="message"){console.log(`${l.THREAD_ID}>${this.__getName__()}[v${this.__getVersion__()}] started: waiting for messages...`),this._multiWorkerHandler=async r=>{if(e==="connect"&&!r.data){r.ports[0].onmessage=this._multiWorkerHandler,r.ports[0].rpcPortId="DEFAULT";return}await this._handleRpc(r)},e==="connect"&&"onconnect"in self?(self.onconnect=this._multiWorkerHandler,self.rpcPortId="DEFAULT"):e==="message"&&"onmessage"in self&&(self.onmessage=this._multiWorkerHandler,self.rpcPortId="DEFAULT"),this._bindMethods()}async _onMessageChannelMessage(e){await this._multiWorkerHandler(e)}};var w=class{static bindRpc(e){let r=e;r.api||(r.api=0),r.bindRpcFunc(r,e.updateTrackCacheInfo,{}),r.bindRpcFunc(r,e.selectAllAlbums,{hasNoArgs:!0,hasReturn:!0}),r.bindRpcFunc(r,e.selectAlbumWhere,{hasReturn:!0}),r.bindRpcFunc(r,e.selectAllTracksForAlbumWhere,{hasReturn:!0}),r.bindRpcFunc(r,e.selectTrackWhere,{hasReturn:!0}),r.bindRpcFunc(r,e.selectTracksWhere,{hasReturn:!0}),r.bindRpcFunc(r,e.selectKeywordsList,{hasNoArgs:!0,hasReturn:!0}),r.bindRpcFunc(r,e.readFileAsText,{hasReturn:!0}),r.bindRpcFunc(r,e.readTrackAsMarkdown,{hasReturn:!0})}};var T=class o extends k{_albumRecords;_albumIdMap=new Map;_trackTrackRefMap=new Map;_keyswordsList;static VERSION="2.0.1";__getVersion__(){return o.VERSION}__getName__(){return"AlbumStoreWorkerServer"}_bindMethods(){super._bindMethods(),w.bindRpc(this)}async updateTrackCacheInfo(e){if(!e.trackRefsIsInCache)this._trackTrackRefMap.clear();else for(let r in e.trackRefsIsInCache)this._trackTrackRefMap.get(r).isAudioCached=e.trackRefsIsInCache[r]}async selectAllAlbums(){if(this._albumRecords)return{albums:this._albumRecords};let e=await o._loadFromJsonDbRec("0-album-index");this._albumRecords=[];for(let r=0;r<e.albumTable.length;r++){let t={...e.albumTable[r],index:r,tracks:null};this._albumRecords.push(t),this._albumIdMap.set(t.id,t)}return{albums:this._albumRecords}}async selectAlbumWhere(e){await this.selectAllAlbums();let r=null;return typeof e.albumIdx=="number"?r=this._albumRecords[e.albumIdx]:r=this._albumIdMap.get(e.albumId),{album:r}}async selectAllTracksForAlbumWhere(e){let t=(await this.selectAlbumWhere(e)).album;if(e.forceRefresh===void 0&&(e.forceRefresh=!1),t.tracks===null||e.forceRefresh){t.tracks=[];let n=await o._loadFromJsonDbRec(t.id.replaceAll("/","_"));for(let a=0;a<n.length;a++){let s=n[a],i=t.id+"/"+s.id,d=await g.isAudioInCache(i),u={...s,albumIndex:t.index,albumId:t.id,index:a,trackRef:i,isAudioCached:d[0]};t.tracks.push(u),this._trackTrackRefMap.set(i,u)}}return{tracks:t.tracks}}async selectTrackWhere(e){let r=this._trackTrackRefMap.get(e.trackRef);if(!r){let[t,n]=c.parseTrackRefElements(e.trackRef),s=(await this.selectAlbumWhere({albumId:t})).album;await this.selectAllTracksForAlbumWhere({albumIdx:s.index}),r=this._trackTrackRefMap.get(e.trackRef)}return{track:r}}async selectTracksWhere(e){let r=[];for(let t=0;t<e.trackRefs.length;t++){let n=await this.selectTrackWhere({trackRef:e.trackRefs[t]});r.push(n.track)}return{tracks:r}}async selectKeywordsList(){return this._keyswordsList||(this._keyswordsList=await o._fetchJsonUrl("./github-di/track-storage/0-keyword-vocabulary.json")),{keywords:this._keyswordsList}}async readFileAsText(e){let r=await fetch(e.path),t=null,n;return r.ok?t=await r.text():n=`Resource: ${e.path} was not found!`,{text:t,err:n}}async readTrackAsMarkdown(e){let r=c.queryTrackTextUrl(e.trackRef),t=await this.readFileAsText({path:r});return t.err?t:{text:b.markupContent(t.text,e.markupHeaders,e.markTextRanges)}}static async _loadFromJsonDbRec(e){let r=this._getJsonDbRecUrl(e);return await o._fetchJsonUrl(r)}static async _fetchJsonUrl(e){return await(await fetch(e)).json()}static _getJsonDbRecUrl(e){return`./github-di/track-storage/${e}-db-rec.json`}},A=new T;A.startServer();})();
