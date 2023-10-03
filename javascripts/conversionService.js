modelUIDs = [
        "baa72dcd-2d7a-4fa3-9b40-024ad78a1b04", //vimek
        "e85cca51-feed-4dfc-925a-40abf0587bc1", //steering 1
        "ddea3362-9ee9-44bd-a659-52e23c8647da", //engine 1
]

async function startViewer(modelName) {
        var viewer;
        let sessioninfo = await caasClient.getStreamingSession();
        await caasClient.enableStreamAccess(sessioninfo.sessionid, modelUIDs);
        
        viewer = new Communicator.WebViewer({
                containerId: "viewerContainer",
                endpointUri: sessioninfo.endpointUri,
                model: modelName,
                streamingMode: Communicator.StreamingMode.OnDemand,
                boundingPreviewMode: 'none',
                enginePath: "https://cdn.jsdelivr.net/gh/techsoft3d/hoops-web-viewer",
                rendererType: 0
        });

        viewer.start();

        return viewer;

}

async function fetchVersionNumber() {
  let data = await caasClient.getHCVersion();
  versionNumer = data;        
  return data
}


async function initializeViewer() {
 var findNode = function (nodeId, name) {
        var children = hwv.getModel().getNodeChildren(nodeId);
        for (var i = 0; i < children.length; i++) {
          if (hwv.getModel().getNodeName(children[i]) === name) {
            return children[i];
  
          } else {
            ret = findNode(children[i], name);
            if (ret != -1) return ret;
          }
        }
        return -1;
      };
  
      const models = ['vimek', 'steering1', 'engine1'];
  
      hwv = await startViewer('vimek')
  
      hwv.setCallbacks({
        sceneReady: function (camera) {
          $('#modelBrowserWindow').css('visibility', 'hidden');
          $('#modelBrowserWindow').css('opacity', '0');
          hwv.getSelectionManager().setHighlightLineElementSelection(false);
          hwv.getSelectionManager().setHighlightFaceElementSelection(false);
          hwv.getSelectionManager().setSelectParentIfSelected(false);
          hwv.getView().setAmbientOcclusionEnabled(true);
          hwv.getView().setAmbientOcclusionRadius(0.02);
        },
        modelStructureReady: function () {
          hwv.getModel().setEnableAutomaticUnitScaling(true);
          hwv.getModel().setNodesVisibility([craneID, trailerID, engineid1], false);
          var model = hwv.getModel();
          var root = model.getRootNode();
          var steering1matrix = [
            3.1881105443735048e-18,
            0.081,
            -3.799442194844606e-18,
            0,
            -0.05206579638460966,
            4.95981953654678e-18,
            0.06204959989263721,
            0,
            0.06204959989263721,
            0,
            0.05206579638460966,
            0,
            -70,
            0,
            74.5,
            0.81
          ];
          var lspromise = model.loadSubtreeFromModel(0, "steering1");
          lspromise.then(function (res) {
            steering2 = findNode(0, "1956_2200_00");
            STEERING_2.push(steering2);
            hwv.getModel().setNodeMatrix(steering2, Communicator.Matrix.createFromArray(steering1matrix)).then(function (res) {
              ;
              setTimeout(function () { hwv.getModel().setNodesVisibility([steering2], false); }, 1000);
              var lspromise = model.loadSubtreeFromModel(0, "engine1");
              lspromise.then(function (res) {
                engineid2 = findNode(0, "01-2_engine");
  
                var enginematrix = [0, -0.05, 0, 0, 0, 0, -0.05, 0, 0.05, 0, 0, 0, -35, 0, 30, 1];
  
                hwv.getModel().setNodeMatrix(engineid2, Communicator.Matrix.createFromArray(enginematrix));
                hwv.getModel().setNodesVisibility([engineid2], false);
              });
              STEERING_WHEELS = STEERING_1.concat(STEERING_2);
              hwv.getModel().requestNodes([2]);
              setView(1);
            });
          });
        },
      });
  
      const uiConfig = {
        containerId: "content",
        screenConfiguration: Sample.screenConfiguration,
      }
      const ui = new Communicator.Ui.Desktop.DesktopUi(hwv, uiConfig);
  
      window.onresize = function () { hwv.resizeCanvas(); };
}