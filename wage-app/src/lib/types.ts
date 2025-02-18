export interface WageData {
    GET_STATS_DATA: GETSTATSDATA;
}

export interface GETSTATSDATA {
    RESULT: RESULT;
    PARAMETER: PARAMETER;
    STATISTICAL_DATA: STATISTICALDATA;
}

export interface STATISTICALDATA {
    RESULT_INF: RESULTINF;
    TABLE_INF: TABLEINF;
    CLASS_INF: CLASSINF;
    DATA_INF: DATAINF;

}

export interface DATAINF {
    NOTE: NOTE[];
    VALUE: VALUE[];
}

export interface VALUE {
    '@tab': string;
    '@cat01': string;
    '@cat02': string;
    '@area': string;
    '@time': string;
    '@unit': string;
    '$': string;
}

export interface NOTE {
    '@char': string;
    '$': string;
}

export interface CLASSINF {
    CLASS_OBJ: CLASSOBJ[];
}

export interface CLASSOBJ {
    '@id': string;
    '@name': string;
    CLASS: CLASS[];
}

export interface CLASS {
    '@code': string;
    '@name': string;
    '@level': string;
    '@unit'?: string;
    '@parentCode'?: string;
}

export interface TABLEINF {
    '@id': string;
    STAT_NAME: STATNAME;
    GOV_ORG: STATNAME;
    STATISTICS_NAME: string;
    TITLE: string;
    CYCLE: string;
    SURVEY_DATE: number;
    OPEN_DATE: string;
    SMALL_AREA: number;
    COLLECT_AREA: string;
    MAIN_CATEGORY: STATNAME;
    SUB_CATEGORY: STATNAME;
    OVERALL_TOTAL_NUMBER: number;
    UPDATED_DATE: string;
    STATISTICS_NAME_SPEC: STATISTICSNAMESPEC;
    DESCRIPTION: string;
    TITLE_SPEC: TITLESPEC;
}

export interface TITLESPEC {
    TABLE_CATEGORY: string;
    TABLE_NAME: string;
}

export interface STATISTICSNAMESPEC {
    TABULATION_CATEGORY: string;
}

export interface STATNAME {
    '@code': string;
    '$': string;
}

export interface RESULTINF {
    TOTAL_NUMBER: number;
    FROM_NUMBER: number;
    TO_NUMBER: number;
    NEXT_KEY: number;
}

export interface PARAMETER {
    LANG: string;
    STATS_DATA_ID: string;
    DATA_FORMAT: string;
    START_POSITION: number;
    METAGET_FLG: string;
    EXPLANATION_GET_FLG: string;
    ANNOTATION_GET_FLG: string;
    REPLACE_SP_CHARS: number;
    CNT_GET_FLG: string;
    SECTION_HEADER_FLG: number;
}

export interface RESULT {
    STATUS: number;
    ERROR_MSG: string;
    DATE: string;
}

export type Job = {
    code: string;
    name: string;
};

export type IndustryJobs = {
    [industry: string]: Job[];
};

export type PrefectureCategoryEntry = {
    category: string,
    values: PrefectureEntryValue[]
}

export type PrefectureEntryValue = {
    job: {
        code: string,
        name: string
    },
    amount: number
}