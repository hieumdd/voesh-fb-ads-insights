import { Readable } from 'node:stream';
import Joi from 'joi';

import { CreateLoadStreamConfig } from '../bigquery.service';
import { getInsightsStream } from '../facebook/insights.service';
import { PipelineOptions } from './pipeline.request.dto';

export type Pipeline = {
    name: string;
    getExtractStream: (options: PipelineOptions) => Promise<Readable>;
    validationSchema: Joi.Schema;
    loadConfig: CreateLoadStreamConfig;
};

const actionBreakdownSchema = Joi.array()
    .items({ action_type: Joi.string(), value: Joi.number() })
    .optional();

export const ADS_INSIGHTS: Pipeline = {
    name: 'AdsInsights',
    getExtractStream: getInsightsStream({
        level: 'ad',
        fields: [
            'date_start',
            'date_stop',
            'account_id',
            'campaign_id',
            'campaign_name',
            'adset_id',
            'adset_name',
            'ad_id',
            'ad_name',
            'actions',
            'action_values',
            'clicks',
            'cost_per_action_type',
            'cpc',
            'cpm',
            'ctr',
            'frequency',
            'impressions',
            'inline_link_click_ctr',
            'inline_link_clicks',
            'reach',
            'spend',
        ],
    }),
    validationSchema: Joi.object({
        date_start: Joi.string(),
        date_stop: Joi.string(),
        account_id: Joi.string(),
        campaign_id: Joi.string(),
        campaign_name: Joi.string(),
        adset_id: Joi.string(),
        adset_name: Joi.string(),
        ad_id: Joi.string(),
        ad_name: Joi.string(),
        clicks: Joi.number().optional(),
        cpc: Joi.number().optional(),
        cpm: Joi.number().optional(),
        ctr: Joi.number().optional(),
        frequency: Joi.number().optional(),
        impressions: Joi.number().optional(),
        inline_link_click_ctr: Joi.number().optional(),
        inline_link_clicks: Joi.number().optional(),
        reach: Joi.number().optional(),
        spend: Joi.number().optional(),
        actions: actionBreakdownSchema,
        action_values: actionBreakdownSchema,
        cost_per_action_type: actionBreakdownSchema,
    }),
    loadConfig: {
        schema: [
            { name: 'date_start', type: 'DATE' },
            { name: 'date_stop', type: 'DATE' },
            { name: 'account_id', type: 'NUMERIC' },
            { name: 'campaign_id', type: 'NUMERIC' },
            { name: 'campaign_name', type: 'STRING' },
            { name: 'adset_id', type: 'NUMERIC' },
            { name: 'adset_name', type: 'STRING' },
            { name: 'ad_id', type: 'NUMERIC' },
            { name: 'ad_name', type: 'STRING' },
            { name: 'cpc', type: 'NUMERIC' },
            { name: 'cpm', type: 'NUMERIC' },
            { name: 'ctr', type: 'NUMERIC' },
            { name: 'frequency', type: 'NUMERIC' },
            { name: 'impressions', type: 'NUMERIC' },
            { name: 'inline_link_click_ctr', type: 'NUMERIC' },
            { name: 'inline_link_clicks', type: 'NUMERIC' },
            { name: 'reach', type: 'NUMERIC' },
            { name: 'spend', type: 'NUMERIC' },
            {
                name: 'actions',
                type: 'RECORD',
                mode: 'REPEATED',
                fields: [
                    { name: 'action_type', type: 'STRING' },
                    { name: 'value', type: 'NUMERIC' },
                ],
            },
            {
                name: 'action_values',
                type: 'RECORD',
                mode: 'REPEATED',
                fields: [
                    { name: 'action_type', type: 'STRING' },
                    { name: 'value', type: 'NUMERIC' },
                ],
            },
            { name: 'clicks', type: 'NUMERIC' },
            {
                name: 'cost_per_action_type',
                type: 'RECORD',
                mode: 'REPEATED',
                fields: [
                    { name: 'action_type', type: 'STRING' },
                    { name: 'value', type: 'NUMERIC' },
                ],
            },
        ],
        writeDisposition: 'WRITE_APPEND',
    },
};
