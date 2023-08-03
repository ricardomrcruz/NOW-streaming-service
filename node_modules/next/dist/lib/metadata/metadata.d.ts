/// <reference types="react" />
import { LoaderTree } from '../../server/lib/app-dir-module';
import { GetDynamicParamFromSegment } from '../../server/app-render/app-render';
export declare function MetadataTree({ tree, pathname, searchParams, getDynamicParamFromSegment, }: {
    tree: LoaderTree;
    pathname: string;
    searchParams: {
        [key: string]: any;
    };
    getDynamicParamFromSegment: GetDynamicParamFromSegment;
}): Promise<JSX.Element>;
