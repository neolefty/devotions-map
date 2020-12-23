export const mockTestEnv = () =>
    jest.mock("./GetEnvConfig", () => ({
        GetEnvConfig: () => ({
            mapboxToken: 'not a real token',
            mapboxStyleUrl: 'mapbox://styles/neolefty/ckfvridqx1tl619obkj1dnkli/draft',
            region: {
                sw: {lat: 0, lng: 0},
                ne: {lat: 1, lng: 1},
            }
        }),
    }))

mockTestEnv()

// it('sets up test env', () => {
//     expect(Config.mapboxToken).toBe('not a real token')
// })

it('does something', () => {
    expect(1).toBeTruthy()
})
