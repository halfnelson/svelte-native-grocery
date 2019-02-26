<script>
    import { AsComponent } from "svelte-native/components"
    import { componentAsListItem } from "svelte-native/svelte-helpers"
    import { alert } from "tns-core-modules/ui/dialogs"
    import { fetchItems, addItem } from "../shared/listService"

    let itemTemplate;
    let groceryList = [];
    let grocery = "";
    let groceryInput;

    //load
    fetchItems().then(items => groceryList = items);

    const add = () => {
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
        debugger;
    }

    let deleteItem = (args) => {
        debugger;
    }
</script>


<page xmlns="tns">
    <actionBar title="Groceries"></actionBar>
    <gridLayout rows="auto, *">
        <gridLayout row="0" columns="*, auto" class="add-bar">
            <textField text="{ grocery }" on:textChange="{(e) => grocery = e.value}" bind:this="{groceryInput}"
                hint="Enter a grocery item" col="0" />
            <image src="~/images/add.png" on:tap="{add}" col="1" />
        </gridLayout>
        <radListView items="{ groceryList }" row="1" use:componentAsListItem="{() => itemTemplate}"  on:itemSwipeProgressStarted="{onSwipeCellStarted}"
                swipeActions="true">
            <AsComponent bind:component={itemTemplate} let:item>
                <gridLayout class="grocery-list-item">
                    <label class="p-15" text="{ item.name }" />
                </gridLayout>
            </AsComponent>
            <radListView.itemSwipeTemplate>
                <gridLayout columns="*,auto" backgroundColor="red">
                    <stackLayout id="delete-view" col="1" on:tap="{deleteItem}" class="delete-view">
                        <image src="~/images/delete.png" />
                    </stackLayout>
                </gridLayout>
            </radListView.itemSwipeTemplate>
        </radListView>
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

    Label {
        background-color: white;
        border-bottom-width: 1;
        border-bottom-color: gray;
    }
</style>