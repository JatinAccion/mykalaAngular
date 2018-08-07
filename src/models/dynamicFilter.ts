export class DynamicFilters {
    constructor(
        public appendSelect: boolean,
        public level: number,
        public data: Array<any>,
        public selectedValues: Array<any>,
        public selectedString?: string,
        public pALevel?: number
    ) { }
}