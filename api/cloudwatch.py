import boto3
import datetime
import urllib
import time
import os

measurable_metrics = [
    ('BucketSizeBytes', 'StandardStorage', 'Megabytes'),
    ('NumberOfObjects', 'AllStorageTypes', 'Count'), 
]

class Cloudwatch:
    def __init__(self, conf, log):
        session = boto3.session.Session()
        self.cloudwatch = session.client('cloudwatch',
                                region_name=conf['S3_REGION'],
                                endpoint_url=conf['S3_ENDPOINT'],
                                aws_access_key_id=conf['S3_KEY'],
                                aws_secret_access_key=conf['S3_SECRET'])
        self.log = log

    def bucket_stats(self, name, date):
        '''Get the number object count and size of a bucket on a given date.'''

        results = {}

        for metric_name, storage_type, unit in measurable_metrics: 
            print(f'metric_name: {metric_name}, storage_type: {storage_type}, unit: {unit}')         
            metrics = self.cloudwatch.get_metric_statistics(
                Namespace = 'AWS/S3',
                MetricName = metric_name,
                StartTime = date - datetime.timedelta(days = 7),
                EndTime = date,
                Period = 86400, # seconds in one day
                Statistics = ['Sum'],
                Dimensions = [
                    {'Name': 'BucketName', 'Value': name},
                    {'Name': 'StorageType', 'Value': storage_type},
                ],
                Unit=unit
            )
            print(f'metrics: {metrics}')

            if metrics['Datapoints']:
                results[metric_name] = sorted(metrics['Datapoints'], key = lambda row: row['Timestamp'])[-1]['Sum']
                
                continue

        return results

    def stat(self):
        date = datetime.datetime.utcnow().replace(hour = 0, minute = 0, second = 0, microsecond = 0)

        print('name', 'region', 'bytes', 'objects', sep = '\t')
        r = []
        # for bucket in sorted(self.s3.buckets.all(), key = lambda bucket: bucket.name):
        bucket_name = 'neehow'
        results = self.bucket_stats(bucket_name, date)
        s = bucket_name, results.get('region'), int(results.get('BucketSizeBytes', 0)), int(results.get('NumberOfObjects', 0))
        r.append(s)
        print(**s, sep = '\t')
        return r
