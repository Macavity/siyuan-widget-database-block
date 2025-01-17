import Widget from "@/components/widget.svelte";
import "siyuan-app/app/appearance/icons/ant/icon"
import "siyuan-app/app/appearance/icons/material/icon"
import "./index.scss"

let widgetElement = document.getElementById("widget");
new Widget({
    target: widgetElement
})