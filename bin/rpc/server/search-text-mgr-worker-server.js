"use strict";(()=>{var d=class{static defer(){let e,r,s=new Promise((a,o)=>{e=a,r=o}),n=s;return n.resolve=e,n.reject=r,s}};var i=class t{static THREAD_TYPES=["Window","DedicatedWorkerGlobalScope","ServiceWorkerGlobalScope","SharedWorkerGlobalScope"];static THREAD_TYPE=self.constructor.name;static THREAD_TYPE_IDX=t.THREAD_TYPES.indexOf(t.THREAD_TYPE);static THREAD_ID;static IS_MOBILE_PLATFORM;static _debounceTimer;static deepClone(e){if(e===null||typeof e!="object")return e;if(Array.isArray(e))return e.map(s=>t.deepClone(s));let r={};for(let s in e)e.hasOwnProperty(s)&&(r[s]=t.deepClone(e[s]));return r}static debounce(e,r){clearTimeout(t._debounceTimer),t._debounceTimer=setTimeout(e,r)}static _setIsMobilePlatform(){if(t.IS_MOBILE_PLATFORM!==void 0)return;let e=navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i),r="ontouchstart"in(t.THREAD_TYPE_IDX===0?window:self),s="accelerometer"in(t.THREAD_TYPE_IDX===0?window:self);t.IS_MOBILE_PLATFORM=!!(e||r||s),console.log(`Thread#[${t.THREAD_TYPE_IDX}].IS_MOBILE=${t.IS_MOBILE_PLATFORM}`)}static _setThreadId(){if(t.THREAD_TYPE_IDX===0)t.THREAD_ID=t.THREAD_TYPE;else if(t.THREAD_TYPE_IDX===2){let e="/indeterminant-scriptURL";"serviceWorker"in self&&"scriptURL"in self.serviceWorker&&(e=self.serviceWorker.scriptURL),t.THREAD_ID=`sw${e.substring(e.lastIndexOf("/"))}`}else if(t.THREAD_ID=self.name,!t.THREAD_ID)throw new Error("IllegalState: All web workers & shared workers must be named via the constructor!")}static{t._setThreadId(),t._setIsMobilePlatform()}};var l=class t{static _resolvedPromise=Promise.resolve(void 0);static _promiseHashMap=new Map;api=NaN;_rpcIdxFuncMap=new Map;_rpcFuncIdxMap=new Map;_orderedTransferredPortMaps=[];_namedTransferredPortMaps=new Map;bindRpcFunc(e,r,s){let n=this._rpcIdxFuncMap.size;this._rpcIdxFuncMap.set(n,{thisArg:e,run:r,...s}),this._rpcFuncIdxMap.set(r,n)}_prepareMessage(e,r){let s={headers:{request:{id:i.THREAD_ID,context:this.__getName__(),portId:"<required>"}},api:this.api,rpc:this._rpcFuncIdxMap.get(e)};if(Number.isNaN(s.api)||s.rpc===void 0)throw new Error(`IllegalArgument: [${JSON.stringify(s)}]; indeterminate API/RPC target!`);let n=this._rpcIdxFuncMap.get(s.rpc);if(!n.hasNoArgs){if(r===void 0)throw new Error(`IllegalArgument: [${JSON.stringify(s)}] requires argument to be set before post!`);s.args=r}return n.hasReturn&&(s.returnPromise=!0),s}_bindMethods(e=!0){this._rpcIdxFuncMap.clear(),this._rpcFuncIdxMap.clear(),e&&this._bindSystemFuncs()}_bindSystemFuncs(){this.bindRpcFunc(this,this.__teardown__,{hasNoArgs:!0}),this.bindRpcFunc(this,this.__transferPorts__,{hasServerTransferredPorts:!0}),this.bindRpcFunc(this,this.__getTransferredPorts__,{hasReturn:!0}),this.bindRpcFunc(this,this.__deleteTransferredPorts__)}async _handleRpc(e){if(e.data?.api!==this.api||e.data?.rpc===void 0||this._returnRpcResultIfResolved(e))return;this._registerTransferredPorts(e);let r=this._rpcIdxFuncMap.get(e.data.rpc);if(e.rpcInvoked=r,r)await this._invokeRpcMethod(e);else throw new Error(`IllegalArgument: rpc[${e.data.rpc}] not supported on Context[${this.__getName__()}]`)}_returnRpcResultIfResolved(e){let r=!1,s=e.data.promiseHash;if(s){let n=t._promiseHashMap.get(s);if(n)e.data.promiseHash=void 0,t._promiseHashMap.delete(s),n.resolve(e.data),r=!0;else if(e.data.resp)throw new Error(`IllegalState: ${i.THREAD_ID} received misdirected promiseHash[${s}]`)}return r}_registerTransferredPorts(e){for(let r=0;r<e.ports.length;r++)this._orderedTransferredPortMaps.push(e.ports[r]),e.ports[r].onmessage=async s=>{await this._onMessageChannelMessage(s)},e.ports[r].rpcPortId="altWorkerMC"}_unregisterTransferredPort(e){let r=this._orderedTransferredPortMaps.indexOf(e);r>-1&&(e.close(),e.onmessage=null,this._orderedTransferredPortMaps.splice(r,1))}async _invokeRpcMethod(e){let r=e.rpcInvoked,s=e.target||self,n=r.hasClientPromiseAwait?d.defer():void 0,a=[];r.hasNoArgs||a.push(e.data.args),r.hasClientPromiseAwait&&a.push(n),r.hasServerTransferredPorts&&a.push(e.ports),r.hasMessageEvent&&a.push(e),a.push(s);let o;if(r.thisArg?(r.runBound===void 0&&(r.runBound=r.run.bind(r.thisArg)),o=await r.runBound(...a)):o=await r.run(...a),n&&(o=await n),r.hasReturn){let c={...e.data,resp:o};c.headers.response={id:i.THREAD_ID,context:this.__getName__(),portId:s.rpcPortId},s.postMessage(c)}}_postMessage(e,r,s){let n=this._preparePostMessageReturnPromise(r);return s=this._preparePostMessageOptions(s),r.headers.request.portId=e.rpcPortId,e.postMessage(r,s),this._alertMessageDispatched(),n}_preparePostMessageReturnPromise(e){let r=t._resolvedPromise;return e.returnPromise&&(e.promiseHash=crypto.randomUUID(),e.returnPromise=void 0,r=d.defer(),t._promiseHashMap.set(e.promiseHash,r)),r}_preparePostMessageOptions(e){return e}_alertMessageDispatched(){}},h=class{isActive=!1;port;constructor(e){this.port=e}setup(){}teardown(){this.port.close()}setRpcPortId(e){this.port.rpcPortId||(this.port.rpcPortId=e)}preparePostMessageOptions(e){return e}getRecipient(){return this.port}alertMessageDispatched(){}setEventListener(e,r,s){this.port.onmessage=r}};var g=class extends l{_multiWorkerHandler;async __teardown__(){let e=arguments[0];if(e instanceof MessagePort&&this._unregisterTransferredPort(e),i.THREAD_TYPE_IDX===1&&"close"in e){let r=e;r.onmessage=null,r.close()}}async __transferPorts__(e,r){let s=r.length-e.portIds.length;r.forEach((n,a,o)=>{a>=s&&(this._namedTransferredPortMaps.set(e.portIds[a-s],n),n.rpcPortId=e.portIds[a-s])})}async __getTransferredPorts__(){return{portIds:Array.from(this._namedTransferredPortMaps.keys())}}async __deleteTransferredPorts__(e){e.portIds.forEach((r,s,n)=>{let a=this._namedTransferredPortMaps.get(r);this._unregisterTransferredPort(a),this._namedTransferredPortMaps.delete(r)})}startServer(e="message"){console.log(`${i.THREAD_ID}>${this.__getName__()}[v${this.__getVersion__()}] started: waiting for messages...`),this._multiWorkerHandler=async r=>{if(e==="connect"&&!r.data){r.ports[0].onmessage=this._multiWorkerHandler,r.ports[0].rpcPortId="DEFAULT";return}await this._handleRpc(r)},e==="connect"&&"onconnect"in self?(self.onconnect=this._multiWorkerHandler,self.rpcPortId="DEFAULT"):e==="message"&&"onmessage"in self&&(self.onmessage=this._multiWorkerHandler,self.rpcPortId="DEFAULT"),this._bindMethods()}async _onMessageChannelMessage(e){await this._multiWorkerHandler(e)}};var u=class extends l{_responder;constructor(e){super(),this._responder=e,this._responder.setRpcPortId("DEFAULT")}async __teardown__(){let e=this._prepareMessage(this.__teardown__);await this._postMessage(this._getRecipient(),e)}async __transferPorts__(e,r){let s=this._prepareMessage(this.__transferPorts__,e);e.portIds.forEach((n,a,o)=>{this._namedTransferredPortMaps.set(n,r[a])}),await this._postMessage(this._getRecipient(),s,r)}async __getTransferredPorts__(){let e=this._prepareMessage(this.__getTransferredPorts__);return{portIds:(await this._postMessage(this._getRecipient(),e)).resp.portIds}}async __deleteTransferredPorts__(e){let r=this._prepareMessage(this.__deleteTransferredPorts__,e);await this._postMessage(this._getRecipient(),r),e.portIds.forEach((s,n,a)=>{this._namedTransferredPortMaps.delete(s)})}startClient(){this._responder.setup(),this._responder.setEventListener("message",async e=>{await this._handleRpc(e)}),this._bindMethods(),console.log(`${i.THREAD_ID}>${this.__getName__()} started: waiting for messages...`)}async stopClient(){let e=Array.from(this._namedTransferredPortMaps.keys());await this.__deleteTransferredPorts__({portIds:e}),await this.__teardown__(),this._responder.teardown(),this._responder.setEventListener("message",null),this._bindMethods(!1)}_preparePostMessageOptions(e){return this._responder.preparePostMessageOptions(e)}_getRecipient(){return this._responder.getRecipient()}_alertMessageDispatched(){this._responder.alertMessageDispatched()}async _onMessageChannelMessage(e){await this._handleRpc(e)}};var _=class{static bindRpc(e){let r=e;r.api||(r.api=0),r.bindRpcFunc(r,e.updateTrackCacheInfo,{}),r.bindRpcFunc(r,e.selectAllAlbums,{hasNoArgs:!0,hasReturn:!0}),r.bindRpcFunc(r,e.selectAlbumWhere,{hasReturn:!0}),r.bindRpcFunc(r,e.selectAllTracksForAlbumWhere,{hasReturn:!0}),r.bindRpcFunc(r,e.selectTrackWhere,{hasReturn:!0}),r.bindRpcFunc(r,e.selectTracksWhere,{hasReturn:!0}),r.bindRpcFunc(r,e.selectKeywordsList,{hasNoArgs:!0,hasReturn:!0}),r.bindRpcFunc(r,e.readFileAsText,{hasReturn:!0}),r.bindRpcFunc(r,e.readTrackAsMarkdown,{hasReturn:!0})}};var R=class extends u{__getName__(){return"AlbumStoreWorkerClient"}_bindMethods(){super._bindMethods(),_.bindRpc(this)}async updateTrackCacheInfo(e){let r=this._prepareMessage(this.updateTrackCacheInfo,e),s=await this._postMessage(this._getRecipient(),r)}async selectAllAlbums(){let e=this._prepareMessage(this.selectAllAlbums);return(await this._postMessage(this._getRecipient(),e)).resp}async selectAlbumWhere(e){let r=this._prepareMessage(this.selectAlbumWhere,e);return(await this._postMessage(this._getRecipient(),r)).resp}async selectAllTracksForAlbumWhere(e){let r=this._prepareMessage(this.selectAllTracksForAlbumWhere,e);return(await this._postMessage(this._getRecipient(),r)).resp}async selectTrackWhere(e){let r=this._prepareMessage(this.selectTrackWhere,e);return(await this._postMessage(this._getRecipient(),r)).resp}async selectTracksWhere(e){let r=this._prepareMessage(this.selectTracksWhere,e);return(await this._postMessage(this._getRecipient(),r)).resp}async selectKeywordsList(){let e=this._prepareMessage(this.selectKeywordsList);return(await this._postMessage(this._getRecipient(),e)).resp}async readFileAsText(e){let r=this._prepareMessage(this.readFileAsText,e);return(await this._postMessage(this._getRecipient(),r)).resp}async readTrackAsMarkdown(e){let r=this._prepareMessage(this.readTrackAsMarkdown,e);return(await this._postMessage(this._getRecipient(),r)).resp}};var b=class{static bindRpc(e){let r=e;r.api||(r.api=3),r.bindRpcFunc(r,e.setup),r.bindRpcFunc(r,e.teardown,{hasNoArgs:!0}),r.bindRpcFunc(r,e.search),r.bindRpcFunc(r,e.onQueryState,{hasNoArgs:!0,hasReturn:!0}),r.bindRpcFunc(r,e.onPaused),r.bindRpcFunc(r,e.onUnpausedAwait,{hasNoArgs:!0,hasClientPromiseAwait:!0,hasReturn:!0}),r.bindRpcFunc(r,e.onProgressUpdate),r.bindRpcFunc(r,e.onFinished)}},k=class{static bindRpc(e){let r=e;r.api||(r.api=3),r.bindRpcFunc(r,e.setup),r.bindRpcFunc(r,e.teardown,{hasNoArgs:!0}),r.bindRpcFunc(r,e.search,{hasReturn:!0}),r.bindRpcFunc(r,e.onSearch),r.bindRpcFunc(r,e.onMatch)}};var f=class extends u{__getName__(){return"SearchTextWorkerClient"}onSearch_;onSearch=async e=>{await this.onSearch_(e)};onMatch_;onMatch=async e=>{await this.onMatch_(e)};async setup(e){let r=this._prepareMessage(this.setup,e);await this._postMessage(this._getRecipient(),r)}async teardown(){let e=this._prepareMessage(this.teardown);await this._postMessage(this._getRecipient(),e)}async search(e){let r=this._prepareMessage(this.search,e);return(await this._postMessage(this._getRecipient(),r)).resp}_bindMethods(){super._bindMethods(),k.bindRpc(this)}};var P=class t extends g{albumStoreClient;stClientsMap=new Map;static VERSION="2.0.0";__getVersion__(){return t.VERSION}__getName__(){return"SearchTextManagerWorkerServer"}onQueryState=async()=>{let e=this._prepareMessage(this.onQueryState);return(await this._postMessage(self,e,void 0)).resp};onPaused=async e=>{let r=this._prepareMessage(this.onPaused,e);await this._postMessage(self,r,void 0)};onUnpausedAwait=async e=>{let r=this._prepareMessage(this.onUnpausedAwait);return(await this._postMessage(self,r,void 0)).resp};async onProgressUpdate(e){let r=this._prepareMessage(this.onProgressUpdate,e);await this._postMessage(arguments[1],r)}async onFinished(e){let r=this._prepareMessage(this.onFinished,e);await this._postMessage(arguments[1],r)}async setup(e){let r=this._namedTransferredPortMaps.get(e.albumStorePortId),s=new h(r);this.albumStoreClient=new R(s),this.albumStoreClient.startClient(),e.portIds.forEach((n,a)=>{let o=this._namedTransferredPortMaps.get(n),c=new h(o),m=new f(c);this.stClientsMap.set(n,m),m.startClient()})}async teardown(){await this.albumStoreClient.stopClient();for(let[e,r]of this.stClientsMap)await r.stopClient()}async search(e){await new M(this,arguments[1]).processWorkload(e)}_bindMethods(){super._bindMethods(),b.bindRpc(this)}},p=new P;p.startServer();var M=class{returnToSender;albumRecords;server;allWorkers=[];availableWorkers=[];runSheet=new Map;workloadSize=0;completedCount=0;nextWorkerProm;constructor(e,r){this.server=e,this.server.stClientsMap.forEach((s,n,a)=>{this.allWorkers.push(s),this.availableWorkers.push(s)}),this.returnToSender=r}async processWorkload(e){let r=[];await this.prepareAlbumSearchOrder(e.scope);for(let s=0;s<this.albumRecords.length;s++){let n=this.albumRecords[s],{tracks:a}=await p.albumStoreClient.selectAllTracksForAlbumWhere({albumIdx:n.index});for(let o=0;o<a.length;o++){let{isPaused:c}=await p.onQueryState();c&&(await p.onPaused({isPaused:c}),await p.onUnpausedAwait(),await p.onPaused({isPaused:c}));let m=await this._getNextAvailableWorker(a[o].trackRef),w=this._processTask(m,a[o].trackRef,e.criteria);r.push(w)}}await Promise.all(r)}_processTask(e,r,s){return new Promise(async a=>{let o=await e.search({trackRef:r,criteria:s});await this._onTaskEnd(r),a()})}async _onTaskEnd(e){this.completedCount++;let r=this.runSheet.get(e);this.runSheet.delete(e);let s=this.allWorkers.indexOf(r);this.availableWorkers.push(r),this.nextWorkerProm&&this.nextWorkerProm.resolve(r);let n=this.completedCount/this.workloadSize;await this.server.onProgressUpdate({progress:n},this.returnToSender),this.completedCount===this.workloadSize&&await this.server.onFinished({count:this.completedCount},this.returnToSender)}async _getNextAvailableWorker(e){for(;this.completedCount<this.workloadSize;){let r=this.availableWorkers.pop();if(r){let n=this.allWorkers.indexOf(r);return this.runSheet.set(e,r),r}this.nextWorkerProm=d.defer();let s=await this.nextWorkerProm;this.nextWorkerProm=null}}async prepareAlbumSearchOrder(e){if(e.startFromAlbumIndex===void 0&&(e.startFromAlbumIndex=0),e.searchAllAlbums){let r=await p.albumStoreClient.selectAllAlbums();if(this.albumRecords=r.albums,e.startFromAlbumIndex>0){let s=this.albumRecords.splice(e.startFromAlbumIndex,1);this.albumRecords.splice(0,0,...s)}}else{let r=await p.albumStoreClient.selectAlbumWhere({albumIdx:e.startFromAlbumIndex});this.albumRecords=[r.album]}for(let r=0;r<this.albumRecords.length;r++)this.workloadSize+=this.albumRecords[r].size}};})();
