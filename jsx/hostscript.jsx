/*
var obj = {
    "media": "1220",
    "width": "300",
    "height": "400",
    "lamination": "mat",
    "cut": "cut"
}
setXMP(obj);
*/

var XMPtool = {
        ns: "",
        prefix: "ID_meta:",//custom metada
        f : new Object,
        read : function(prop){//read exist custom metadata.
            if(xmpLib == undefined) var xmpLib = new ExternalObject("lib:AdobeXMPScript");
            var xmpFile = new XMPFile(this.f.fsName, XMPConst.UNKNOWN, XMPConst.OPEN_FOR_READ);
            var xmpPackets = xmpFile.getXMP();
            var xmp = new XMPMeta(xmpPackets.serialize());
            $.writeln(this.ns);
            try{
                $.writeln(xmp.getProperty(this.ns,prop).toString());
                return xmp.getProperty(this.ns,prop).toString();
            }catch(e){
                $.writeln(prop + ":is nothing property");
                return false;
            }
        },
        write:function(prop,val){
            try{
            //argumetns{prop:String/property of custom metadata, val1:String/value} 
                if(xmpLib==undefined) var xmpLib = new ExternalObject("lib:AdobeXMPScript");
                var xmpFile = new XMPFile(this.f.fsName,XMPConst.UNKNOWN, XMPConst.OPEN_FOR_UPDATE);
                var xmp = xmpFile.getXMP();
                var mt = new XMPMeta(xmp.serialize());
                XMPMeta.registerNamespace(this.ns, this.prefix);
                mt.setProperty(this.ns,prop,val);
                if(xmpFile.canPutXMP(xmp)) xmpFile.putXMP(mt);
                xmpFile.closeFile(XMPConst.CLOSE_UPDATE_SAFELY);
                return true;
            }catch(e){
                alert(e);
                return false;
            }
        }
    }

    function readXmp(obj){
        for(var k in obj){
            XMPtool.read(k);
        }
    }
    function writeXmp(obj){
        for(var k in obj){
            /*上書きしたくない場合はプロパティーの有無を確認
            if(!XMPtool.read(k)){
                continue;
            }
            */
            XMPtool.write(k,obj[k]);
        }
        alert("finished write");
    }


function setXMP(obj){
    if(!isSelect()) return false; 
    synchronousMode = true
    var doc = app.document;
    var select = doc.selections[0];
    XMPtool.f  = new File(select.path);
    XMPtool.ns = "ns.example.com/comment/1.0";
    XMPtool.prefix = "customPreFix:";
    //readXmp(obj);
    writeXmp(obj);
}

function loadXMP(array){
    if(!isSelect()) return false; 
    synchronousMode = true
    var doc = app.document;
    var select = doc.selections[0];
    XMPtool.f  = new File(select.path);
    XMPtool.ns = "ns.example.com/comment/1.0";
    XMPtool.prefix = "customPreFix:";
    var load = {};
    for(var i=0;i<array.length;i++){
        try{
            load[array[i]] = XMPtool.read(array[i]);
        }catch(e){
            alert(e);
            continue;
        }
    }
    return JSON.stringify(load);
}

function isSelect(){
    if(app.document.selections.length != 1){
        alert("select file just one");
        return false;
    }
    return true;
}