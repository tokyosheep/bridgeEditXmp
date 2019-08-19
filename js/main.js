window.onload = () =>{
    "use strict";
    const csInterface = new CSInterface();
    themeManager.init();
    
    const filePath = csInterface.getSystemPath(SystemPath.EXTENSION) +`/js/`;
    const extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) +`/jsx/`;
    csInterface.evalScript(`$.evalFile("${extensionRoot}json2.js")`);//json2読み込み
    
    const XMPdata = document.getElementById("XMPdata");
    const loadXMP = document.getElementById("loadXMP");
    const writeArea = document.getElementById("writeArea");
    const writeXMP = document.getElementById("writeXMP");
    const importText = document.getElementById("importText");
    
    const fs = require("fs");
    const path = require("path");
    
    const json_test = filePath + "test.json";
    
    class EventClass{
        constructor(btn){
            this.btn = btn;
            this.btn.addEventListener("click",this);
        }
    }
    
    class SetXMP extends EventClass{
        constructor(btn){
            super(btn);
        }
        
        handleEvent(){
            const order = Array.from(document.getElementsByClassName("order"));
            const obj = {};
            order.forEach(v=>{ obj[v.id] = v.value });
            console.log(obj);
            csInterface.evalScript(`setXMP(${JSON.stringify(obj)})`);
            /*
            ( async()=>{
                write_file_disk(obj,json_test);
            })();
            */
        }
    }
    
    const s = new SetXMP(writeXMP);
    
    
    class LoadXMP extends EventClass{
        constructor(btn){
            super(btn);
        }
        
        async handleEvent(){
            const keyNames = Array.from(document.getElementsByClassName("order")).map(v=> v.id);
            console.log(keyNames);
            const XMPdata = await this.loadXMP(keyNames).catch(err => alert(err));
            const text = Object.entries(XMPdata).reduce((accumulatar,currentVlaue)=>{
                return accumulatar +"\n"+ currentVlaue;
            });
            console.log(text);
            writeArea.textContent = text;
            
        }
        
        loadXMP(array){
            return new Promise((resolve,reject)=>{
                csInterface.evalScript(`loadXMP(${JSON.stringify(array)})`,(o)=>{
                    console.log(o);
                    if(!o) reject("select file just one");
                    const XMPdata = JSON.parse(o);
                    resolve(XMPdata);
                });
            });
        }
    }
    
    const load = new LoadXMP(loadXMP);
    
    class WriteText extends EventClass{
        constructor(btn){
            super(btn);
        }
        
        async handleEvent(){
            const currentPath = await getCurrentPath();
            console.log(currentPath);
            fs.writeFile(`${currentPath}/data.txt`,writeArea.value,err=>{
                if(err){ 
                    alert(err);
                    return;
                }
                alert("text was wrote");
            });
        }
    }
    
    const write = new WriteText(importText);
    
    function getCurrentPath(){
        return new Promise((resolve,reject)=>{
            csInterface.evalScript(`$.evalFile("${extensionRoot}getCurrentPath.jsx")`,(o)=>{
                if(!o) reject(false);
                resolve(o);
            });
        });
    }
    
    function write_file_disk(data,json_path){//debug用関数
        return new Promise((resolve,reject)=>{
            fs.writeFile(json_path,JSON.stringify(data,null,4),(err)=>{
               if(err){
                   alert(err);
                   reject(false);
               } 
                resolve(true);
            });
        });    
    }
}