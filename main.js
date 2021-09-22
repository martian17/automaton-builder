let Editor = function(lang){//editor class, creates a new editor
    let wrap = new ELEM("div","class:editor-wrapper");
    let txt = wrap.add("textarea","spellcheck:false;");
    let pre = wrap.add("pre","aria-hidden:true;");
    let code = pre.add("code","class:language-"+lang);
    
    //events
    let scroll = function(){
        console.log("fired");
        pre.e.scrollTop = this.scrollTop;
        pre.e.scrollLeft = this.scrollLeft;
    };
    let checkTab = function(e){
        //just a code to insert tab instead of the usual switching action
        if(e.key === "Tab") {
            e.preventDefault();
            let value = this.value;
            let head = value.slice(0, this.selectionStart);
            let tail =  value.slice(this.selectionEnd, value.length);
            //have to calculate the position before i change the value
            let position = this.selectionStart + 1;
            this.value = head + "\t" + tail; // add tab char
            // move cursor
            this.selectionStart = position;
            this.selectionEnd = position;
            update.bind(txt.e)(); // Update text to include indent
        }
    };
    let update = function(){
        let value = this.value;
        if(value[value.length-1] == "\n") {
          value += " ";//trailing space preservation
        }
        //reconstructing the code element so it can be accessed by Prism
        code.e.innerHTML = value.replace(/\&/g, "&amp;").replace(/\</g, "&lt;");//escaping html
        Prism.highlightElement(code.e);
    };
    
    
    txt.on("scroll",scroll);
    txt.on("keydown",checkTab);
    txt.on("input",update,scroll);
    
    Prism.highlightElement(code.e);
    this.e = wrap.e;
    
    
    this.inputSomeText = function(str) {
        txt.e.value = str;
        let evt1 = new Event('change');
        let evt2 = new Event('input');
        txt.e.dispatchEvent(evt1);
        txt.e.dispatchEvent(evt2);
    };
};

let editor;

let main = function(){
    editor = new Editor("javascript");
    document.querySelector("#output>div:first-child").appendChild(editor.e);
};

main();
