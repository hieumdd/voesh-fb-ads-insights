import * as pipelines from './pipeline.const';
import { createInsightsPipelineTasks, runPipeline } from './pipeline.service';

it('pipeline', async () => {
    return runPipeline(pipelines.ADS_INSIGHTS, {
        accountId: '10201599994504245',
        start: '2023-02-01',
        end: '2023-04-01',
    })
        .then((results) => {
            expect(results).toBeDefined();
        })
        .catch((error) => {
            console.error({ error });
            return Promise.reject(error);
        });
});

it('create-tasks-insights', async () => {
    return createInsightsPipelineTasks({
        start: '2023-01-01',
        end: '2023-03-01',
    })
        .then((result) => expect(result).toBeDefined())
        .catch((error) => {
            console.error({ error });
            return Promise.reject(error);
        });
});
