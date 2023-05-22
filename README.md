# compass

- only native draw calls
- no external dependencies
- compass toggle setting saved to client locally
- rendertime of ~100μs per tick

<img width="100%" alt="image" src="https://github.com/JohnDeved/fivem-compass/assets/24187269/8c4944b9-eb68-4504-82bd-26453753def1">

# exports

### `compass:toggle` 
**params:**
```ts
(): void
```
**description:** toggle compass on/off

---
### `compass:setSettings`
params: 
```ts
(settings: {
    isCompassVisible?: boolean
    compassWidth?: number
    compassY?: number
    compassColor?: [number, number, number]
    directions?: string[]
    controlKey?: number
}): void
```
