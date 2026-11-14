// The nation profile's JSON Schema, at the address it names as its own:
// https://style.eurth.org/schemas/eurth-profile-1.json
//
// The schema lists a section for every tool, so like everything else here it waits: the file
// exists only in builds made after the last door has opened. The nightly rebuild brings it in.
import schema from '@eurth/profile/schema.json';
import type { APIRoute } from 'astro';
import { unlaunchedTools } from '../../../../src/build.js';

export function getStaticPaths() {
  return unlaunchedTools().length ? [] : [{ params: { name: 'eurth-profile-1' } }];
}

export const GET: APIRoute = () => new Response(`${JSON.stringify(schema, null, 2)}\n`, { headers: { 'Content-Type': 'application/schema+json; charset=utf-8' } });
