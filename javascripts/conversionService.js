modelUIDs = [
        "707947a9-7df8-4720-bafd-e2d9b3a0d020", //vimek
        "38d50b36-2633-406c-b51a-026ac86874c5", //steering 1
        "57ef57b9-5249-47c9-875a-e92a8664b111", //engine 1
]

async function startViewer(modelName) {
        const conversionServiceURI = "https://csapi.techsoft3d.com";

        var viewer;

        let res = await fetch(conversionServiceURI + '/api/streamingSession');
        var data = await res.json();
        var endpointUriBeginning = 'ws://';

        if(conversionServiceURI.substring(0, 5).includes("https")){
                endpointUriBeginning = 'wss://'
        }

        await fetch(conversionServiceURI + '/api/enableStreamAccess/' + data.sessionid, { method: 'put', headers: { 'items': JSON.stringify(modelUIDs) } });

        viewer = new Communicator.WebViewer({
                containerId: "viewerContainer",
                endpointUri: endpointUriBeginning + data.serverurl + ":" + data.port + '?token=' + data.sessionid,
                model: modelName,
                streamingMode: Communicator.StreamingMode.OnDemand,
                boundingPreviewMode: 'none',
                enginePath: "https://cdn.jsdelivr.net/gh/techsoft3d/hoops-web-viewer@latest",
                rendererType: 0
        });

        viewer.start();

        return viewer;

}
