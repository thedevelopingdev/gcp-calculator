#!/usr/bin/env python

import os
import argparse
import googleapiclient.discovery as ds


def main(args):
    compute = ds.build("compute", "v1")

    ret = compute.instances().list(project=args.project, zone=args.zone).execute()
    print(ret)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()

    parser.add_argument("project")

    parser.add_argument("--zone",
        help="GCP zone",
        default=os.environ.get("GCP_ZONE", None)
    )


    args = parser.parse_args()
    
    if args.zone is None:
        print("Zone was not specified, either at the command line or through "
              "environment variable `GCP_ZONE`")
        quit()

    main(args)
