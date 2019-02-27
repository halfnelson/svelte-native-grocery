import { NativeElementNode, createElement } from "svelte-native/dom";
import { RadListView, ListViewEventData } from "nativescript-ui-listview";
import { View } from "tns-core-modules/ui/core/view/view";

export default class RadListViewElement extends NativeElementNode {
    constructor() {
        super('radlistview', RadListView, null);
        let nativeView = this.nativeView as RadListView;

        nativeView.itemViewLoader = (viewType: any): View => this.loadView(viewType)
        this.nativeView.on(RadListView.itemLoadingEvent, (args) => { this.updateListItem(args as ListViewEventData) });
    }

    loadView(viewType: string): View {
        let componentClass = this.getComponentForView(viewType);
        if (!componentClass) return null;

        console.log("creating view for ",viewType)
        let wrapper = createElement('StackLayout') as NativeElementNode;
        let componentInstance = new componentClass({
            target: wrapper,
            props: {
                item: {}
            }
        });

        let nativeEl = wrapper.nativeView;
        (nativeEl as any).__SvelteComponent__ = componentInstance;
        return nativeEl;
    }

    getComponentForView(viewType: string): any {
        const normalizedViewType = viewType.toLowerCase();
        let templateEl = this.childNodes.find(n => n.tagName == "template" && String(n.getAttribute("type")).toLowerCase() == normalizedViewType) as any;
        if (!templateEl) 
            return null;
        return templateEl.component;
    }

    updateListItem(args: ListViewEventData) {
        let item;
        let listView = this.nativeView as RadListView;
        let items = listView.items;

        if (args.index >= items.length) {
            console.log("Got request for item at index that didn't exists", items, args.index)
            return;
        }

        if (items.getItem) {
            item = items.getItem(args.index);
        } else {
            item = items[args.index]
        }

        if (args.view && (args.view as any).__SvelteComponent__) {
            let componentInstance: SvelteComponent = (args.view as any).__SvelteComponent__
            console.log("updating view for ", args.index, args.view)
            componentInstance.$set({ item })
        } else {
            console.log("got invalid update call with", args.index, args.view)
        }
    }
}