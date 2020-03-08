define([
    "printMap/html2canvas",
    "dojo/_base/array",
    "dojo/on",
    "dojo/dom",
    "dojo/_base/lang",
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!printMap/printBtn.html"
], function (html2canvas, arrayUtil, on, dom, lang, declare, _WidgetBase, _TemplateMixin, template) {
    return declare([_WidgetBase, _TemplateMixin], {
        templateString: template,
        printDiv: null,
        map: null,

        constructor: function (args) {
            declare.safeMixin(this, args);
        },
        postCreate: function () {
            this.event();
        },
        event: function () {
            on(dom.byId("printBtn"), "click", lang.hitch(this, function () {

                //地图根节点
                var node = this.map.root;
                //开始截图
                html2canvas(node, {
                    useCORS: true    //解决图片跨域问题
                }).then(lang.hitch(this,function (canvas) {
                    var imageUrl = canvas.toDataURL();
                    var url = this.dataURL2Blob(imageUrl);

                    var link = document.createElement("a");
                    link.href = URL.createObjectURL(url);
                    link.download = "打印";
                    link.click();
                }))
            }))
        },
        //base64转为blob对象
        dataURL2Blob: function (dataUrl) {
            var arr = dataUrl.split(",");
            var mime = arr[0].match(/:(.*?);/)[1];
            var base64 = atob(arr[1]);
            var n = base64.length;
            var u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = base64.charCodeAt(n);
            }
            return new Blob([u8arr], { type: mime });
        }
    })
})