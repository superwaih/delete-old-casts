import { Configuration, NeynarAPIClient } from "@neynar/nodejs-sdk"


const config = new Configuration({
  apiKey: "1D6A156E-9D42-447D-B098-4F611CFF78B5",
})

const neynarClient = new NeynarAPIClient(config)

export default neynarClient
