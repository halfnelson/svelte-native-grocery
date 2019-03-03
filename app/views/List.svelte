<script>
    import { Template } from "svelte-native/components"
    import { ListViewViewTypes } from "nativescript-ui-listview"
    import { alert } from "tns-core-modules/ui/dialogs"
    import { fetchItems, addItem, deleteItem } from "../shared/listService"
    import { onMount } from "svelte"
    import { fade } from 'svelte-native/transitions'

    let itemTemplate;
    let isLoading = false;
    let groceryList = [];
    let grocery = "";
    let groceryInput;
    let listLoaded = false;

    onMount(() => {
        //load
        isLoading = true;
        fetchItems().then(items => {
            isLoading = false;
            listLoaded = true;
            groceryList = items
        });
    });

    const doAdd = () => {
        if (grocery.trim() === "") {
            alert({
                message: "Enter a grocery item",
                okButtonText: "OK"
            });
            return;
        }
        groceryInput.nativeView.dismissSoftInput();
        addItem(grocery)
            .then(item => groceryList = [...groceryList, item])
            .catch(() => {
                alert({
                    message: "An error occurred while adding an item to your list.",
                    okButtonText: "OK"
                });
            });
        grocery = "";
    }

    let onSwipeCellStarted = (args) => {
        var swipeLimits = args.data.swipeLimits;
        var swipeView = args.object;
        var rightItem = swipeView.getViewById('delete-view');
        swipeLimits.right = rightItem.getMeasuredWidth();
        swipeLimits.left = 0;
        swipeLimits.threshold = rightItem.getMeasuredWidth() / 2;
    }

    let doDelete = (args) => {
        var item = args.view.bindingContext;
        if (groceryList.indexOf(item) < 0) return;
        deleteItem(item).then(() => {
            groceryList = groceryList.filter(i => i != item);
        }).catch(() => {
            alert({
                message: "An error occurred while removing the item from your list.",
                okButtonText: "OK"
            });
        });
    }
</script>


<page>
    <actionBar title="Groceries"></actionBar>
    <gridLayout rows="auto, *">
        <gridLayout row="0" columns="*, auto" class="add-bar">
            <textField bind:text="{grocery}" bind:this="{groceryInput}"
                hint="Enter a grocery item" col="0" />
            <image src="~/images/add.png" on:tap="{doAdd}" col="1" />
        </gridLayout>
        {#if listLoaded}
        <radListView items="{ groceryList }" row="1" on:itemSwipeProgressStarted="{onSwipeCellStarted}"
            swipeActions="true" transition:fade="{{duration: 1000 }}" >
            <Template type="{ListViewViewTypes.ItemView}" let:item>
                <gridLayout class="grocery-list-item">
                    <label class="p-15" text="{ item.name }" />
                </gridLayout>
            </Template>
            <Template type="{ListViewViewTypes.ItemSwipeView}" let:item>
                <gridLayout columns="*,auto" backgroundColor="red">
                    <stackLayout id="delete-view" col="1" on:tap="{doDelete}" class="delete-view">
                        <image src="~/images/delete.png" />
                    </stackLayout>
                </gridLayout>
            </Template>
        </radListView>
        {/if}
        <activityIndicator busy="{ isLoading }" row="1" horizontalAlignment="center" verticalAlignment="center" />
    </gridLayout>

</page>

<style>
    .add-bar {
        background-color: #CB1D00;
        padding: 5;
    }

    .add-bar Image {
        height: 15;
        vertical-align: center;
        margin-left: 10;
        margin-right: 10;
    }

    .add-bar TextField {
        padding: 10;
    }

    .delete-view {
        background-color: #CB1D00;
        padding: 20;
    }

    .delete-view Image {
        color: white;
    }

    Label {
        background-color: white;
        border-bottom-width: 1;
        border-bottom-color: gray;
    }

   
</style>