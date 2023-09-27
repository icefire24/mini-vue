import typescript from '@rollup/plugin-typescript'
export default {
    input: "./src/index.ts",
    output: [
        {
            format: "cjs",
            file:"lib/cjs.js"
        },
        {
            format: "es",
            file:"lib/esm.js"
        }
    ],
    plugins: [
        typescript()
    ]

}