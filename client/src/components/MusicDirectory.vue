<template>
    <div class="container">
        <h1>{{ message }}</h1>
        <a href='/login'>Connect to Osu</a>
    </div>
</template>

<script lang="ts">
export default {
    name: 'MusicDirectory',
    methods: {
        connect: function (): void {
            console.log('hi!');
        },
    },
    data() {
        return {
            message:
                'This is an introduction page without anything! maybe a button?',
        };
    },
};
</script>

<style scoped>
.container {
    width: 600px;
    margin: 50px auto;
    text-align: center;
}
</style>
