import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import { CounterClient } from '@my/grpc/counter/counter.client';
import { AddRequest, SubtractRequest, ResetRequest, IncrementRequest, DecrementRequest, GetValueRequest } from '@my/grpc/counter/counter';

const baseUrl = import.meta.env.VITE_GRPC_BASE_URL ?? 'http://127.0.0.1:3000';

const transport = new GrpcWebFetchTransport({
  baseUrl,
  fetchInit: { credentials: 'include' },
  format: 'binary',
  timeout: 10000,
});

const client = new CounterClient(transport);

const out = document.getElementById('out') as HTMLPreElement;
const valueEl = document.getElementById('value') as HTMLSpanElement;
const numInput = document.getElementById('num') as HTMLInputElement;
const btnGet = document.getElementById('btn-get') as HTMLButtonElement;
const btnInc = document.getElementById('btn-inc') as HTMLButtonElement;
const btnDec = document.getElementById('btn-dec') as HTMLButtonElement;
const btnAdd = document.getElementById('btn-add') as HTMLButtonElement;
const btnSub = document.getElementById('btn-sub') as HTMLButtonElement;
const btnReset = document.getElementById('btn-reset') as HTMLButtonElement;

function log(msg: unknown) {
  out.textContent = typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2);
}

function showValue(v: bigint | number) {
  valueEl.textContent = v.toString();
}

async function refresh() {
  const req: GetValueRequest = {};
  const { response } = await client.getValue(req);
  showValue(response.value);
}

btnGet.addEventListener('click', async () => {
  try {
    await refresh();
    log('GetValue OK');
  } catch (e) {
    log(e instanceof Error ? e.message : String(e));
  }
});

btnInc.addEventListener('click', async () => {
  try {
    const req: IncrementRequest = {};
    const { response } = await client.increment(req);
    showValue(response.value);
    log('Increment OK');
  } catch (e) {
    log(e instanceof Error ? e.message : String(e));
  }
});

btnDec.addEventListener('click', async () => {
  try {
    const req: DecrementRequest = {};
    const { response } = await client.decrement(req);
    showValue(response.value);
    log('Decrement OK');
  } catch (e) {
    log(e instanceof Error ? e.message : String(e));
  }
});

btnAdd.addEventListener('click', async () => {
  try {
    const n = BigInt(numInput.value || '0');
    const req: AddRequest = { value: n };
    const { response } = await client.add(req);
    showValue(response.value);
    log('Add OK');
  } catch (e) {
    log(e instanceof Error ? e.message : String(e));
  }
});

btnSub.addEventListener('click', async () => {
  try {
    const n = BigInt(numInput.value || '0');
    const req: SubtractRequest = { value: n };
    const { response } = await client.subtract(req);
    showValue(response.value);
    log('Subtract OK');
  } catch (e) {
    log(e instanceof Error ? e.message : String(e));
  }
});

btnReset.addEventListener('click', async () => {
  try {
    const n = BigInt(numInput.value || '0');
    const req: ResetRequest = { value: n };
    const { response } = await client.reset(req);
    showValue(response.value);
    log('Reset OK');
  } catch (e) {
    log(e instanceof Error ? e.message : String(e));
  }
});

log(`Ready. Using gRPC base URL: ${baseUrl}`);
// Try initial read
refresh().catch(() => {});
