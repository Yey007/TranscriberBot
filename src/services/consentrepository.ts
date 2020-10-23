import { injectable } from "inversify";

@injectable()
export class ConsentRepository {

    //User id to state
    private consentMap: Map<string, ConsentState>

    public constructor() {
        this.consentMap = new Map()
    }

    public get(userid: string): ConsentState {
        let state = this.consentMap.get(userid)
        if (state === undefined) {
            return ConsentState.Unknown
        }
        return state
    }

    public set(userid: string, state: ConsentState) {
        this.consentMap.set(userid, state)
    } 
}

export enum ConsentState {
    Consent,
    NoConsent,
    Unknown,
}