<script>
    import { login, register } from "../shared/loginService.ts"
    import { alert } from "tns-core-modules/ui/dialogs"
    import { navigate } from "svelte-native"
    import List from "./List.svelte"

    let email = ""
    let password = ""
    let isLoggingIn = true;

    let submit = () => { isLoggingIn ? doSignIn() : doRegister() }

    let toggleDisplay = () => { isLoggingIn = !isLoggingIn }

    let doSignIn = () => {
        login(email, password)
            .catch(function (error) {
                console.log(error);
                alert({
                    message: "Unfortunately we could not find your account.",
                    okButtonText: "OK"
                });
                return Promise.reject();
            })
            .then(function () {
                navigate({ page: List });
            });
    }
    let doRegister = () => {
        register(email, password)
            .then(function () {
                alert("Your account was successfully created.")
            }).catch(function (error) {
                alert({
                    message: "Unfortunately we were unable to create your account.",
                    okButtonText: "OK"
                });
            });
    }
</script>

<page actionBarHidden="{true}">
    <flexboxLayout>
        <stackLayout class="form { isLoggingIn ? '' : 'dark' }">
            <image src="~/images/logo.png" />

            <textField hint="Email Address" bind:text="{email}" keyboardType="email"
                autocorrect="false" autocapitalizationType="none" class="input input-border" />
            <textField hint="Password" secure="true" bind:text="{password}" class="input input-border" />

            <button text="{ isLoggingIn ? 'Sign in' : 'Sign up' }" class="btn btn-primary" on:tap="{submit}" />
            <button text="{ isLoggingIn ? 'Sign up' : 'Back to login' }" on:tap="{toggleDisplay}" />

        </stackLayout>
    </flexboxLayout>
</page>

<style>
    FlexboxLayout {
        justify-content: center;
        align-items: center;
        background-size: cover;
        background-image: url("~/images/background.jpg");
    }

    StackLayout {
        width: 300;
        padding: 10 16;
        background-color: #f0f0f0;
    }

    Image {
        margin-bottom: 20;
        height: 70;
    }

    Button,
    TextField {
        margin-bottom: 10;
    }

    .btn-primary {
        background-color: #CB1D00;
        margin-left: 0;
        margin-right: 0;
    }

    TextField {
        placeholder-color: #C4AFB4;
        color: black;
    }

    .dark {
        background-color: #301217;
    }

    .dark TextField {
        color: #C4AFB4;
    }
</style>