"use strict";(()=>{var d=class{static defer(){let e,s,r=new Promise((o,i)=>{e=o,s=i}),t=r;return t.resolve=e,t.reject=s,r}};var a=class n{static THREAD_TYPES=["Window","DedicatedWorkerGlobalScope","ServiceWorkerGlobalScope","SharedWorkerGlobalScope"];static THREAD_TYPE=self.constructor.name;static THREAD_TYPE_IDX=n.THREAD_TYPES.indexOf(n.THREAD_TYPE);static THREAD_ID;static IS_MOBILE_PLATFORM;static _debounceTimer;static deepClone(e){if(e===null||typeof e!="object")return e;if(Array.isArray(e))return e.map(r=>n.deepClone(r));let s={};for(let r in e)e.hasOwnProperty(r)&&(s[r]=n.deepClone(e[r]));return s}static debounce(e,s){clearTimeout(n._debounceTimer),n._debounceTimer=setTimeout(e,s)}static _setIsMobilePlatform(){if(n.IS_MOBILE_PLATFORM!==void 0)return;let e=navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i),s="ontouchstart"in(n.THREAD_TYPE_IDX===0?window:self),r="accelerometer"in(n.THREAD_TYPE_IDX===0?window:self);n.IS_MOBILE_PLATFORM=!!(e||s||r),console.log(`Thread#[${n.THREAD_TYPE_IDX}].IS_MOBILE=${n.IS_MOBILE_PLATFORM}`)}static _setThreadId(){if(n.THREAD_TYPE_IDX===0)n.THREAD_ID=n.THREAD_TYPE;else if(n.THREAD_TYPE_IDX===2){let e="/indeterminant-scriptURL";"serviceWorker"in self&&"scriptURL"in self.serviceWorker&&(e=self.serviceWorker.scriptURL),n.THREAD_ID=`sw${e.substring(e.lastIndexOf("/"))}`}else if(n.THREAD_ID=self.name,!n.THREAD_ID)throw new Error("IllegalState: All web workers & shared workers must be named via the constructor!")}static{n._setThreadId(),n._setIsMobilePlatform()}};var p=class n{static _resolvedPromise=Promise.resolve(void 0);static _promiseHashMap=new Map;api=NaN;_rpcIdxFuncMap=new Map;_rpcFuncIdxMap=new Map;_orderedTransferredPortMaps=[];_namedTransferredPortMaps=new Map;bindRpcFunc(e,s,r){let t=this._rpcIdxFuncMap.size;this._rpcIdxFuncMap.set(t,{thisArg:e,run:s,...r}),this._rpcFuncIdxMap.set(s,t)}_prepareMessage(e,s){let r={headers:{request:{id:a.THREAD_ID,context:this.__getName__(),portId:"<required>"}},api:this.api,rpc:this._rpcFuncIdxMap.get(e)};if(Number.isNaN(r.api)||r.rpc===void 0)throw new Error(`IllegalArgument: [${JSON.stringify(r)}]; indeterminate API/RPC target!`);let t=this._rpcIdxFuncMap.get(r.rpc);if(!t.hasNoArgs){if(s===void 0)throw new Error(`IllegalArgument: [${JSON.stringify(r)}] requires argument to be set before post!`);r.args=s}return t.hasReturn&&(r.returnPromise=!0),r}_bindMethods(e=!0){this._rpcIdxFuncMap.clear(),this._rpcFuncIdxMap.clear(),e&&this._bindSystemFuncs()}_bindSystemFuncs(){this.bindRpcFunc(this,this.__teardown__,{hasNoArgs:!0}),this.bindRpcFunc(this,this.__transferPorts__,{hasReturn:!0,hasServerTransferredPorts:!0}),this.bindRpcFunc(this,this.__getTransferredPorts__,{hasReturn:!0}),this.bindRpcFunc(this,this.__deleteTransferredPorts__)}async _handleRpc(e){if(e.data?.api!==this.api||e.data?.rpc===void 0||this._returnRpcResultIfResolved(e))return;this._registerTransferredPorts(e);let s=this._rpcIdxFuncMap.get(e.data.rpc);if(e.rpcInvoked=s,s)await this._invokeRpcMethod(e);else throw new Error(`IllegalArgument: rpc[${e.data.rpc}] not supported on Context[${this.__getName__()}]`)}_returnRpcResultIfResolved(e){let s=!1,r=e.data.promiseHash;if(r){let t=n._promiseHashMap.get(r);if(t)e.data.promiseHash=void 0,n._promiseHashMap.delete(r),t.resolve(e.data),s=!0;else if(e.data.resp)throw new Error(`IllegalState: ${a.THREAD_ID} received misdirected promiseHash[${r}]`)}return s}_registerTransferredPorts(e){for(let s=0;s<e.ports.length;s++)this._orderedTransferredPortMaps.push(e.ports[s]),e.ports[s].onmessage=async r=>{await this._onMessageChannelMessage(r)},e.ports[s].rpcPortId="altWorkerMC"}_unregisterTransferredPort(e){let s=this._orderedTransferredPortMaps.indexOf(e);s>-1&&(e.close(),e.onmessage=null,this._orderedTransferredPortMaps.splice(s,1))}async _invokeRpcMethod(e){let s=e.rpcInvoked,r=e.target||self,t=s.hasClientPromiseAwait?d.defer():void 0,o=[];s.hasNoArgs||o.push(e.data.args),s.hasClientPromiseAwait&&o.push(t),s.hasServerTransferredPorts&&o.push(e.ports),s.hasMessageEvent&&o.push(e),o.push(r);let i;if(s.thisArg?(s.runBound===void 0&&(s.runBound=s.run.bind(s.thisArg)),i=await s.runBound(...o)):i=await s.run(...o),t&&(i=await t),s.hasReturn){let f={...e.data,resp:i};f.headers.response={id:a.THREAD_ID,context:this.__getName__(),portId:r.rpcPortId},r.postMessage(f)}}_postMessage(e,s,r){let t=this._preparePostMessageReturnPromise(s);return r=this._preparePostMessageOptions(r),s.headers.request.portId=e.rpcPortId,e.postMessage(s,r),this._alertMessageDispatched(),t}_preparePostMessageReturnPromise(e){let s=n._resolvedPromise;return e.returnPromise&&(e.promiseHash=crypto.randomUUID(),e.returnPromise=void 0,s=d.defer(),n._promiseHashMap.set(e.promiseHash,s)),s}_preparePostMessageOptions(e){return e}_alertMessageDispatched(){}},c=class{isActive=!1;port;constructor(e){this.port=e}setup(){}teardown(){this.port.close()}setRpcPortId(e){this.port.rpcPortId||(this.port.rpcPortId=e)}preparePostMessageOptions(e){return e}getRecipient(){return this.port}alertMessageDispatched(){}setEventListener(e,s,r){this.port.onmessage=s}};var l=class extends p{_multiWorkerHandler;async __teardown__(){let e=arguments[0];if(e instanceof MessagePort&&this._unregisterTransferredPort(e),a.THREAD_TYPE_IDX===1&&"close"in e){let s=e;s.onmessage=null,s.close()}}async __transferPorts__(e,s){let r=s.length-e.portIds.length,t=0;for(let o=0;o<s.length;o++){let i=s[o];o>=r&&(this._namedTransferredPortMaps.set(e.portIds[o-r],i),i.rpcPortId=e.portIds[o-r]),t++}return{count:t}}async __getTransferredPorts__(){return{portIds:Array.from(this._namedTransferredPortMaps.keys())}}async __deleteTransferredPorts__(e){e.portIds.forEach((s,r,t)=>{let o=this._namedTransferredPortMaps.get(s);this._unregisterTransferredPort(o),this._namedTransferredPortMaps.delete(s)})}startServer(e="message"){console.log(`${a.THREAD_ID}>${this.__getName__()}[v${this.__getVersion__()}] started: waiting for messages...`),this._multiWorkerHandler=async s=>{if(e==="connect"&&!s.data){s.ports[0].onmessage=this._multiWorkerHandler,s.ports[0].rpcPortId="DEFAULT";return}await this._handleRpc(s)},e==="connect"&&"onconnect"in self?(self.onconnect=this._multiWorkerHandler,self.rpcPortId="DEFAULT"):e==="message"&&"onmessage"in self&&(self.onmessage=this._multiWorkerHandler,self.rpcPortId="DEFAULT"),this._bindMethods()}async _onMessageChannelMessage(e){await this._multiWorkerHandler(e)}};var u=class extends p{_responder;constructor(e){super(),this._responder=e,this._responder.setRpcPortId("DEFAULT")}async __teardown__(){let e=this._prepareMessage(this.__teardown__);await this._postMessage(this._getRecipient(),e)}async __transferPorts__(e,s){let r=this._prepareMessage(this.__transferPorts__,e);e.portIds.forEach((o,i,f)=>{this._namedTransferredPortMaps.set(o,s[i])});let t=await this._postMessage(this._getRecipient(),r,s);if(s.length!==t.resp.count)throw new Error(`IllegalState: port mismatch; sent ${s.length} ports, transfered ${t.resp.count}`);return t.resp}async __getTransferredPorts__(){let e=this._prepareMessage(this.__getTransferredPorts__);return{portIds:(await this._postMessage(this._getRecipient(),e)).resp.portIds}}async __deleteTransferredPorts__(e){let s=this._prepareMessage(this.__deleteTransferredPorts__,e);await this._postMessage(this._getRecipient(),s),e.portIds.forEach((r,t,o)=>{this._namedTransferredPortMaps.delete(r)})}startClient(){this._responder.setup(),this._responder.setEventListener("message",async e=>{await this._handleRpc(e)}),this._bindMethods(),console.log(`${a.THREAD_ID}>${this.__getName__()} started: waiting for messages...`)}async stopClient(){let e=Array.from(this._namedTransferredPortMaps.keys());await this.__deleteTransferredPorts__({portIds:e}),await this.__teardown__(),this._responder.teardown(),this._responder.setEventListener("message",null),this._bindMethods(!1)}_preparePostMessageOptions(e){return this._responder.preparePostMessageOptions(e)}_getRecipient(){return this._responder.getRecipient()}_alertMessageDispatched(){this._responder.alertMessageDispatched()}async _onMessageChannelMessage(e){await this._handleRpc(e)}};var g=class{static bindRpc(e){let s=e;s.api||(s.api=1),s.bindRpcFunc(s,e.setup),s.bindRpcFunc(s,e.teardown,{hasNoArgs:!0}),s.bindRpcFunc(s,e.downloadSelections),s.bindRpcFunc(s,e.deleteSelections),s.bindRpcFunc(s,e.onProgressUpdate),s.bindRpcFunc(s,e.onFinished)}},h=class{static bindRpc(e){let s=e;s.api||(s.api=2),s.bindRpcFunc(s,e.downloadTrack,{hasReturn:!0}),s.bindRpcFunc(s,e.deleteTrack,{hasReturn:!0}),s.bindRpcFunc(s,e.onProcessed)}};var _=class extends u{__getName__(){return"OfflineAudioWorkerClient"}onProcessed_;onProcessed=async e=>{await this.onProcessed_(e)};async downloadTrack(e){let s=this._prepareMessage(this.downloadTrack,e);return(await this._postMessage(this._getRecipient(),s)).resp}async deleteTrack(e){let s=this._prepareMessage(this.deleteTrack,e);return(await this._postMessage(this._getRecipient(),s)).resp}_bindMethods(){super._bindMethods(),h.bindRpc(this)}};var R=class n extends l{oatClientsMap=new Map;static VERSION="2.0.0";__getVersion__(){return n.VERSION}__getName__(){return"OfflineAudioManagerWorkerServer"}async onProgressUpdate(e){let s=this._prepareMessage(this.onProgressUpdate,e);await this._postMessage(arguments[1],s)}async onFinished(e){let s=this._prepareMessage(this.onFinished,e);await this._postMessage(arguments[1],s)}async setup(e){e.portIds.forEach((s,r)=>{let t=this._namedTransferredPortMaps.get(s),o=new c(t),i=new _(o);this.oatClientsMap.set(s,i),i.startClient()})}async teardown(){for(let[e,s]of this.oatClientsMap)await s.stopClient()}async downloadSelections(e){await new m(this,!0,arguments[1]).processWorkload(e.selections)}async deleteSelections(e){await new m(this,!1,arguments[1]).processWorkload(e.selections)}_bindMethods(){super._bindMethods(),g.bindRpc(this)}},P=new R;P.startServer();var m=class{returnToSender;server;isDownload;allWorkers=[];availableWorkers=[];runSheet=new Map;workloadSize=0;completedCount=0;nextWorkerProm;constructor(e,s,r){this.server=e,this.server.oatClientsMap.forEach((t,o,i)=>{this.allWorkers.push(t),this.availableWorkers.push(t)}),this.isDownload=s,this.returnToSender=r}async processWorkload(e){let s=[];this.workloadSize=e.length;for(let r=0;r<this.workloadSize;r++){let t=await this._getNextAvailableWorker(e[r]),o=this._processTask(t,e[r]);s.push(o)}await Promise.all(s)}_processTask(e,s){return new Promise(async t=>{let o;this.isDownload?o=await e.downloadTrack({trackRef:s}):o=await e.deleteTrack({trackRef:s}),await this._onTaskEnd(o,this.isDownload),t()})}async _getNextAvailableWorker(e){for(;this.completedCount<this.workloadSize;){let s=this.availableWorkers.pop();if(s){let t=this.allWorkers.indexOf(s);return this.runSheet.set(e,s),s}this.nextWorkerProm=d.defer();let r=await this.nextWorkerProm;this.nextWorkerProm=null}}async _onTaskEnd(e,s){this.completedCount++;let r=this.runSheet.get(e.trackRef);this.runSheet.delete(e.trackRef);let t=this.allWorkers.indexOf(r);this.availableWorkers.push(r),this.nextWorkerProm&&this.nextWorkerProm.resolve(r);let o=this.completedCount/this.workloadSize;await this.server.onProgressUpdate({progress:o},this.returnToSender),this.completedCount===this.workloadSize&&await this.server.onFinished({count:this.completedCount},this.returnToSender)}};})();
