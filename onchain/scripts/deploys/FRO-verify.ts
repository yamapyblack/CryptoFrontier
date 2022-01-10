import { Addresses, Verify, AddressesType } from "../common"

const verify = async (a: AddressesType): Promise<void> => {
    // await Verify(a.FROAddresses, [])

    // await Verify(a.frontier, [a.FROAddresses])
    // await Verify(a.status, [a.FROAddresses])
    // await Verify(a.hp, [a.FROAddresses])
    // await Verify(a.descriptor, [a.FROAddresses])
    // await Verify(a.character, [a.FROAddresses])
    // await Verify(a.reward, [a.FROAddresses])
    // await Verify(a.staking, [a.FROAddresses])
    // await Verify(a.token, [a.FROAddresses])
    // await Verify(a.logic, [a.FROAddresses])
    // await Verify(a.mintLogic, [a.FROAddresses])

    // await Verify(a.FROStatus, [a.FROAddresses])
    // await Verify(a.FROHp, [a.FROAddresses])
    // await Verify(a.FROSvg, [])
    // await Verify(a.FROTokenDescriptor, [a.FROAddresses])
    // await Verify(a.FROCharacter, [a.FROAddresses])
    // await Verify(a.FROMintLogic, [a.FROAddresses])
    // await Verify(a.FROReward, [a.FROAddresses])
    // await Verify(a.FROStaking, [a.FROAddresses])
    // await Verify(a.FROToken, [a.FROAddresses])
    await Verify(a.FROFrontier, [a.FROAddresses])
    // await Verify(a.FROLogic, [a.FROAddresses])
}

const main = async () => {
    const a = Addresses()!

    await verify(a)
    // await Verify("0x77776B57dcE93577a3537aF466Bfe46eC596eeC8", [addresses.addresses])
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

