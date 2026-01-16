/* tslint:disable */
/* eslint-disable */
/**
 * Run a WASIX program.
 *
 * # WASI Compatibility
 *
 * The [WASIX standard][wasix] is a superset of [WASI preview 1][preview-1], so programs
 * compiled to WASI will run without any problems.
 *
 * WASI Preview 2 is a backwards incompatible rewrite of WASI.
 * This means programs compiled for WASI Preview 2 will fail to load.
 *
 * [wasix]: https://wasix.dev/
 * [preview-1]: https://github.com/WebAssembly/WASI/blob/main/legacy/README.md
 */
declare function runWasix(wasm_module: WebAssembly.Module | Uint8Array, config: RunOptions): Promise<Instance>;
declare function wat2wasm(wat: string): Uint8Array;
declare function setSDKUrl(url: string): void;
declare function setWorkerUrl(url: string): void;
/**
 * Initialize the logger used by `@wasmer/wasix`.
 *
 * This function can only be called once. Subsequent calls will raise an
 * exception.
 *
 * ## Filtering Logs
 *
 * The `filter` string can be used to tweak logging verbosity, both globally
 * or on a per-module basis, and follows [the `$RUST_LOG` format][format].
 *
 * Some examples:
 * - `off` - turn off all logs
 * - `error`, `warn`, `info`, `debug`, `trace` - set the global log level
 * - `wasmer_wasix` - enable logs for `wasmer_wasix`
 * - `info,wasmer_js::package_loader=trace` - set the global log level to
 *   `info` and set `wasmer_js::package_loader` to `trace`
 * - `wasmer_js=debug/flush` -  turns on debug logging for
 *   `wasmer_js` where the log message includes `flush`
 * - `warn,wasmer=info,wasmer_wasix::syscalls::wasi=trace` - directives can be
 *   mixed arbitrarily
 *
 * When no `filter` string is provided, a useful default will be used.
 *
 * [format]: https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html#directives
 */
declare function initializeLogger(filter?: string | null): void;

/**
 * An entry in a {@link Directory}.
 */
type DirEntry = {
    /**
     * What type of entry is this?
     */
    type: "file" | "dir" | "unknown";
    /**
     * What is the item's name? (the last component in the path)
     */
    name: string;
};



/**
 * A mapping from file paths to their contents that can be used to initialize
 * a {@link Directory}.
 */
type DirectoryInit = Record<string, string | Uint8Array>;



/**
 * A command available in a package
 */
type PackageCommand = {
    module: string;
    name: string;
    runner: "https://webc.org/runner/wasi";
    annotations?: {
        wasi?: {
            env?: string[];
            "main-args": string[];
        }
    };
};

type VolumeFileData = string | Uint8Array;
type VolumeFileDate = Date | Number;
type VolumeFile = VolumeFileData | { data: VolumeFileData, modified: VolumeFileDate}
type VolumeTree = {
    [name: string]: VolumeFile | VolumeTree
};

/**
 * Manifest of a package.
 * For more information, please check the package manifest docs:
 * https://docs.wasmer.io/registry/manifest
 */
type PackageManifest = {
    command?: PackageCommand[],
    dependencies?: {
        [name:string]: string
    },
    fs: VolumeTree;
};



type Output = {
    /* The program's exit code. */
    code: number;
    /* Did the program exit successfully? */
    ok: boolean;
    /* The contents of the program's stdout stream. */
    stdoutBytes: Uint8Array;
    /* The program's stdout stream, decoded as UTF-8. */
    readonly stdout: string;
    /* The contents of the program's stderr stream. */
    stderrBytes: Uint8Array;
    /* The program's stderr stream, decoded as UTF-8. */
    readonly stderr: string;
}



/**
 * Configuration for an app
 * For more information, please check the app config file:
 * https://docs.wasmer.io/edge/configuration
 */
type BaseAppConfig = {
    /** The package to deploy. */
    package: string | Wasmer;
    /** In debug mode? */
    debug?: boolean;
    /** The environment variables */
    env?: {[name: string]: string};
    /** The CLI arguments */
    cli_args?: string[];
    /** Domains associated to this app */
    domains?: string[];
    /** Redirect rules */
    redirect?: {
        /** Force HTTPs redirects all requests to http://domain/* to https://domain/* */
        force_https?: boolean;
    };
    /** Scaling configuration */
    scaling?: {
        /** How to scale the app */
        mode?: null | "single_concurrency";
    };

    /** Set this version as the default for the app. Is `true` by default */
    default?: boolean;
};

type NamedApp = {
    /** The owner of the app. */
    owner: string;
    /** The name of the app. */
    name: string;
}

type DeployedIdApp = {
    /** The id of the app. */
    id: string;
}

/**
 * A way to identify the app
 */
type AppIdentifier = (NamedApp | DeployedIdApp | (NamedApp & DeployedIdApp));

/**
 * Configuration for an app
 * For more information, please check the app config file:
 * https://docs.wasmer.io/edge/configuration
 */
type AppConfig = AppIdentifier & BaseAppConfig;



/**
 * Options used when constructing a {@link Runtime}.
 */
type RuntimeOptions = {
    /**
     * The GraphQL endpoint for the Wasmer registry used when looking up
     * packages.
     *
     * Defaults to `"https://registry.wasmer.io/graphql"`.
     *
     * If `null`, no queries will be made to the registry.
     */
    registry?: string | null;
    /**
     * An optional API key to use when sending requests to the Wasmer registry.
     */
    apiKey?: string;
    /**
     * Enable networking (i.e. TCP and UDP) via a gateway server.
     */
    networkGateway?: string;
};



/**
 * Common options used when running a WASIX program.
 */
type CommonOptions = {
    /** Additional command-line arguments to be passed to the program. */
    args?: string[];
    /** Environment variables to set. */
    env?: Record<string, string>;
    /** The standard input stream. */
    stdin?: string | Uint8Array;
    /**
     * Directories that should be mounted inside the WASIX instance.
     *
     * This maps mount locations to the {@link Directory} being mounted. As a
     * shortcut, if {@link DirectoryInit} is provided, a new {@link Directory}
     * will be instantiated and mounted.
     *
     * Avoid mounting directly to `"/"` as it may clobber a package's bundled
     * files.
     */
    mount?: Record<string, DirectoryInit | Directory>;
    /** The current working directory. */
    cwd?: string;
};

/**
 * Configuration used when starting a WASIX program with {@link runWasix}.
 */
type RunOptions = CommonOptions & {
    /** The name of the program being run (passed in as arg 0) */
    program?: string;
    /**
     * The WASIX runtime to use.
     *
     * Providing a `Runtime` allows multiple WASIX instances to share things
     * like caches and threadpools. If not provided, a default `Runtime` will be
     * created.
     */
    runtime?: Runtime;
};

/**
 * Options used when running a command from a WASIX package with
 * {@link Command.run}.
 */
type SpawnOptions = CommonOptions & {
    /**
     * Packages that should also be loaded into the WASIX environment.
     */
    uses?: string[];
}


declare class Atom {
  private constructor();
  free(): void;
}
/**
 * A runnable WASIX command.
 */
declare class Command {
  private constructor();
  free(): void;
  rename(name: string): void;
  run(options?: SpawnOptions | null): Promise<Instance>;
  /**
   * Read the binary that will be
   */
  binary(): Uint8Array;
  name: string;
}
declare class DeployedApp {
  private constructor();
  free(): void;
  id: string;
  created_at: string;
  version: string;
  get description(): string | undefined;
  set description(value: string | null | undefined);
  yaml_config: string;
  user_yaml_config: string;
  config: string;
  json_config: string;
  url: string;
  get app_id(): string | undefined;
  set app_id(value: string | null | undefined);
}
/**
 * A directory that can be mounted inside a WASIX instance.
 */
declare class Directory {
  free(): void;
  __getClassname(): string;
  /**
   * Create a new {@link Directory}.
   */
  constructor(init?: DirectoryInit | null);
  /**
   * Read the contents of a directory.
   */
  readDir(path: string): Promise<DirEntry[]>;
  /**
   * Write to a file.
   *
   * If a string is provided, it is encoded as UTF-8.
   */
  writeFile(path: string, contents: string | Uint8Array): Promise<void>;
  /**
   * Read the contents of a file from this directory.
   *
   * Note that the path is relative to the directory's root.
   */
  readFile(path: string): Promise<Uint8Array>;
  /**
   * Read the contents of a file from this directory as a UTF-8 string.
   *
   * Note that the path is relative to the directory's root.
   */
  readTextFile(path: string): Promise<string>;
  /**
   * Create a directory.
   */
  createDir(path: string): Promise<void>;
  /**
   * Remove a directory.
   */
  removeDir(path: string): Promise<void>;
  /**
   * Remove a file.
   */
  removeFile(path: string): Promise<void>;
}
/**
 * A handle connected to a running WASIX program.
 */
declare class Instance {
  private constructor();
  free(): void;
  /**
   * Wait for the process to exit.
   */
  wait(): Promise<Output>;
  /**
   * The standard input stream, if one wasn't provided when starting the
   * instance.
   */
  readonly stdin: WritableStream | undefined;
  /**
   * The WASI program's standard output.
   */
  readonly stdout: ReadableStream;
  /**
   * The WASI program's standard error.
   */
  readonly stderr: ReadableStream;
}
declare class IntoUnderlyingByteSource {
  private constructor();
  free(): void;
  start(controller: ReadableByteStreamController): void;
  pull(controller: ReadableByteStreamController): Promise<any>;
  cancel(): void;
  readonly type: string;
  readonly autoAllocateChunkSize: number;
}
declare class IntoUnderlyingSink {
  private constructor();
  free(): void;
  write(chunk: any): Promise<any>;
  close(): Promise<any>;
  abort(reason: any): Promise<any>;
}
declare class IntoUnderlyingSource {
  private constructor();
  free(): void;
  pull(controller: ReadableStreamDefaultController): Promise<any>;
  cancel(): void;
}
declare class PublishPackageOutput {
  private constructor();
  free(): void;
  manifest: any;
  hash: string;
}
declare class Runtime {
  free(): void;
  __getClassname(): string;
  constructor(options?: RuntimeOptions | null);
  /**
   * Get a reference to the global runtime, optionally initializing it if
   * requested.
   */
  static global(initialize?: boolean | null): Runtime | undefined;
}
declare class User {
  private constructor();
  free(): void;
  id: string;
  username: string;
}
declare class UserPackageDefinition {
  private constructor();
  free(): void;
  __getClassname(): string;
  hash: string;
}
declare class Volume {
  private constructor();
  free(): void;
}
/**
 * A package from the Wasmer registry.
 *
 * @example
 * ```ts
 * import { Wasmer } from "@wasmer/sdk";
 *
 * const pkg = await Wasmer.fromRegistry("wasmer/python");
 * const instance = await pkg.entrypoint!.run({ args: ["--version"]});
 * const { ok, code, stdout, stderr } = await instance.wait();
 *
 * if (ok) {
 *     console.log(`Version:`, stdout);
 * } else {
 *     throw new Error(`Python exited with ${code}: ${stderr}`);
 * }
 * ```
 */
declare class Wasmer {
  private constructor();
  free(): void;
  /**
   * Create a `WasmerPackage`.
   */
  static createPackage(manifest: PackageManifest): Promise<Wasmer>;
  /**
   * Publish a package to the registry.
   */
  static publishPackage(wasmerPackage: Wasmer): Promise<PublishPackageOutput>;
  /**
   * Deploy an app to the registry.
   */
  static deployApp(appConfig: AppConfig): Promise<DeployedApp>;
  /**
   * Delete an app from the registry.
   */
  static deleteApp(app: DeployedIdApp): Promise<void>;
  /**
   * Deploy an app to the registry.
   */
  static whoami(): Promise<User | undefined>;
  __getClassname(): string;
  /**
   * Load a package from the Wasmer registry.
   */
  static fromRegistry(specifier: string, runtime?: Runtime | null): Promise<Wasmer>;
  /**
   * Load a package from a package file.
   */
  static fromFile(binary: Uint8Array, runtime?: Runtime | null): Promise<Wasmer>;
  /**
   * Load a package from a package file.
   */
  static fromWasm(binary: Uint8Array, runtime?: Runtime | null): Wasmer;
  /**
   * The package's entrypoint.
   */
  get entrypoint(): Command | undefined;
  /**
   * The package's entrypoint.
   */
  set entrypoint(value: Command | null | undefined);
  /**
   * A map containing all commands available to the package (including
   * dependencies).
   */
  commands: Record<string, Command>;
  get pkg(): UserPackageDefinition | undefined;
  set pkg(value: UserPackageDefinition | null | undefined);
}
declare class WasmerPackage {
  private constructor();
  free(): void;
  manifest: object;
  data: Uint8Array;
}

type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

interface InitOutput {
  readonly canonical_abi_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbg_intounderlyingsource_free: (a: number, b: number) => void;
  readonly intounderlyingsource_pull: (a: number, b: any) => any;
  readonly intounderlyingsource_cancel: (a: number) => void;
  readonly __wbg_intounderlyingbytesource_free: (a: number, b: number) => void;
  readonly intounderlyingbytesource_type: (a: number) => [number, number];
  readonly intounderlyingbytesource_autoAllocateChunkSize: (a: number) => number;
  readonly intounderlyingbytesource_start: (a: number, b: any) => void;
  readonly intounderlyingbytesource_pull: (a: number, b: any) => any;
  readonly intounderlyingbytesource_cancel: (a: number) => void;
  readonly __wbg_intounderlyingsink_free: (a: number, b: number) => void;
  readonly intounderlyingsink_write: (a: number, b: any) => any;
  readonly intounderlyingsink_close: (a: number) => any;
  readonly intounderlyingsink_abort: (a: number, b: any) => any;
  readonly __wbg_trap_free: (a: number, b: number) => void;
  readonly directory___getClassname: (a: number) => [number, number];
  readonly __wbg_directory_free: (a: number, b: number) => void;
  readonly directory_new: (a: number) => [number, number, number];
  readonly directory_readDir: (a: number, b: number, c: number) => any;
  readonly directory_writeFile: (a: number, b: number, c: number, d: any) => any;
  readonly directory_readFile: (a: number, b: number, c: number) => any;
  readonly directory_readTextFile: (a: number, b: number, c: number) => any;
  readonly directory_createDir: (a: number, b: number, c: number) => any;
  readonly directory_removeDir: (a: number, b: number, c: number) => any;
  readonly directory_removeFile: (a: number, b: number, c: number) => any;
  readonly __wbg_wasmerpackage_free: (a: number, b: number) => void;
  readonly __wbg_set_wasmerpackage_manifest: (a: number, b: any) => void;
  readonly __wbg_get_wasmerpackage_data: (a: number) => [number, number];
  readonly __wbg_atom_free: (a: number, b: number) => void;
  readonly __wbg_publishpackageoutput_free: (a: number, b: number) => void;
  readonly __wbg_get_publishpackageoutput_manifest: (a: number) => any;
  readonly __wbg_set_publishpackageoutput_manifest: (a: number, b: any) => void;
  readonly __wbg_get_publishpackageoutput_hash: (a: number) => [number, number];
  readonly wasmer_createPackage: (a: any) => any;
  readonly wasmer_publishPackage: (a: number) => any;
  readonly runWasix: (a: any, b: any) => any;
  readonly wat2wasm: (a: number, b: number) => [number, number, number];
  readonly on_start: () => void;
  readonly setSDKUrl: (a: any) => void;
  readonly setWorkerUrl: (a: any) => void;
  readonly initializeLogger: (a: number, b: number) => [number, number];
  readonly __wbg_instance_free: (a: number, b: number) => void;
  readonly __wbg_get_instance_stdin: (a: number) => any;
  readonly __wbg_get_instance_stdout: (a: number) => any;
  readonly __wbg_get_instance_stderr: (a: number) => any;
  readonly instance_wait: (a: number) => any;
  readonly __wbg_deployedapp_free: (a: number, b: number) => void;
  readonly __wbg_get_deployedapp_id: (a: number) => [number, number];
  readonly __wbg_set_deployedapp_id: (a: number, b: number, c: number) => void;
  readonly __wbg_get_deployedapp_created_at: (a: number) => [number, number];
  readonly __wbg_set_deployedapp_created_at: (a: number, b: number, c: number) => void;
  readonly __wbg_get_deployedapp_version: (a: number) => [number, number];
  readonly __wbg_set_deployedapp_version: (a: number, b: number, c: number) => void;
  readonly __wbg_get_deployedapp_description: (a: number) => [number, number];
  readonly __wbg_set_deployedapp_description: (a: number, b: number, c: number) => void;
  readonly __wbg_get_deployedapp_yaml_config: (a: number) => [number, number];
  readonly __wbg_set_deployedapp_yaml_config: (a: number, b: number, c: number) => void;
  readonly __wbg_get_deployedapp_user_yaml_config: (a: number) => [number, number];
  readonly __wbg_set_deployedapp_user_yaml_config: (a: number, b: number, c: number) => void;
  readonly __wbg_get_deployedapp_config: (a: number) => [number, number];
  readonly __wbg_set_deployedapp_config: (a: number, b: number, c: number) => void;
  readonly __wbg_get_deployedapp_json_config: (a: number) => [number, number];
  readonly __wbg_set_deployedapp_json_config: (a: number, b: number, c: number) => void;
  readonly __wbg_get_deployedapp_url: (a: number) => [number, number];
  readonly __wbg_set_deployedapp_url: (a: number, b: number, c: number) => void;
  readonly __wbg_get_deployedapp_app_id: (a: number) => [number, number];
  readonly __wbg_set_deployedapp_app_id: (a: number, b: number, c: number) => void;
  readonly wasmer_deployApp: (a: any) => any;
  readonly wasmer_deleteApp: (a: any) => any;
  readonly runtime___getClassname: (a: number) => [number, number];
  readonly __wbg_runtime_free: (a: number, b: number) => void;
  readonly runtime_js_new: (a: number) => [number, number, number];
  readonly runtime_global: (a: number) => [number, number, number];
  readonly __wbg_user_free: (a: number, b: number) => void;
  readonly wasmer_whoami: () => any;
  readonly writablestreamsink_close: (a: number) => any;
  readonly writablestreamsink_abort: (a: number, b: any) => void;
  readonly writablestreamsink_write: (a: number, b: any) => any;
  readonly __wbg_readablestreamsource_free: (a: number, b: number) => void;
  readonly readablestreamsource_pull: (a: number, b: any) => any;
  readonly readablestreamsource_cancel: (a: number) => void;
  readonly readablestreamsource_type: (a: number) => any;
  readonly wasmer___getClassname: (a: number) => [number, number];
  readonly __wbg_wasmer_free: (a: number, b: number) => void;
  readonly __wbg_get_wasmer_entrypoint: (a: number) => number;
  readonly __wbg_set_wasmer_entrypoint: (a: number, b: number) => void;
  readonly __wbg_get_wasmer_commands: (a: number) => any;
  readonly __wbg_set_wasmer_commands: (a: number, b: any) => void;
  readonly __wbg_get_wasmer_pkg: (a: number) => number;
  readonly __wbg_set_wasmer_pkg: (a: number, b: number) => void;
  readonly userpackagedefinition___getClassname: (a: number) => [number, number];
  readonly __wbg_userpackagedefinition_free: (a: number, b: number) => void;
  readonly __wbg_get_userpackagedefinition_hash: (a: number) => [number, number];
  readonly __wbg_set_userpackagedefinition_hash: (a: number, b: number, c: number) => void;
  readonly wasmer_fromRegistry: (a: number, b: number, c: number) => any;
  readonly wasmer_fromFile: (a: any, b: number) => any;
  readonly wasmer_fromWasm: (a: any, b: number) => [number, number, number];
  readonly __wbg_command_free: (a: number, b: number) => void;
  readonly __wbg_get_command_name: (a: number) => any;
  readonly __wbg_set_command_name: (a: number, b: any) => void;
  readonly command_rename: (a: number, b: any) => void;
  readonly command_run: (a: number, b: number) => any;
  readonly command_binary: (a: number) => any;
  readonly __wbg_threadpoolworker_free: (a: number, b: number) => void;
  readonly threadpoolworker_new: (a: number) => number;
  readonly threadpoolworker_handle: (a: number, b: any) => any;
  readonly __wbg_set_wasmerpackage_data: (a: number, b: number, c: number) => void;
  readonly __wbg_get_wasmerpackage_manifest: (a: number) => any;
  readonly canonical_abi_free: (a: number, b: number, c: number) => void;
  readonly trap___wbg_wasmer_trap: () => void;
  readonly __wbg_set_user_username: (a: number, b: number, c: number) => void;
  readonly __wbg_volume_free: (a: number, b: number) => void;
  readonly __wbg_get_user_username: (a: number) => [number, number];
  readonly __wbg_set_publishpackageoutput_hash: (a: number, b: number, c: number) => void;
  readonly __wbg_get_user_id: (a: number) => [number, number];
  readonly __wbg_writablestreamsink_free: (a: number, b: number) => void;
  readonly __wbg_set_user_id: (a: number, b: number, c: number) => void;
  readonly memory: WebAssembly.Memory;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_export_5: WebAssembly.Table;
  readonly __wbindgen_export_6: WebAssembly.Table;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly closure544_externref_shim: (a: number, b: number, c: any) => void;
  readonly closure806_externref_shim: (a: number, b: number) => any;
  readonly closure807_externref_shim: (a: number, b: number, c: any) => number;
  readonly closure1343_externref_shim_multivalue_shim: (a: number, b: number, c: any) => [number, number];
  readonly closure1345_externref_shim_multivalue_shim: (a: number, b: number, c: any) => [number, number, number];
  readonly closure191_externref_shim: (a: number, b: number, c: any, d: any) => void;
  readonly __wbindgen_thread_destroy: (a?: number, b?: number, c?: number) => void;
  readonly __wbindgen_start: (a: number) => void;
}

type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput, memory?: WebAssembly.Memory, thread_stack_size?: number }} module - Passing `SyncInitInput` directly is deprecated.
* @param {WebAssembly.Memory} memory - Deprecated.
*
* @returns {InitOutput}
*/
declare function initSync(module: { module: SyncInitInput, memory?: WebAssembly.Memory, thread_stack_size?: number } | SyncInitInput, memory?: WebAssembly.Memory): InitOutput;

type WasmerRegistryConfig = {
    registryUrl?: string;
    token?: string;
};
type WasmerInitInput = {
    module?: InitInput | Promise<InitInput>;
    memory?: WebAssembly.Memory;
    workerUrl?: string | URL;
    sdkUrl?: string | URL;
    log?: string;
} & WasmerRegistryConfig;
/**
 * Initialize the underlying WebAssembly module.
 */
declare const init: (initValue?: WasmerInitInput, memory?: WebAssembly.Memory) => Promise<InitOutput>;
declare const setRegistry: (initValue: WasmerRegistryConfig) => void;

export { type AppConfig, type AppIdentifier, Atom, type BaseAppConfig, Command, DeployedApp, type DeployedIdApp, type DirEntry, Directory, type DirectoryInit, type InitInput, type InitOutput, Instance, IntoUnderlyingByteSource, IntoUnderlyingSink, IntoUnderlyingSource, type NamedApp, type Output, type PackageCommand, type PackageManifest, PublishPackageOutput, type RunOptions, Runtime, type RuntimeOptions, type SpawnOptions, type SyncInitInput, User, UserPackageDefinition, Volume, type VolumeFile, type VolumeFileData, type VolumeFileDate, type VolumeTree, Wasmer, type WasmerInitInput, WasmerPackage, type WasmerRegistryConfig, init, initSync, initializeLogger, runWasix, setRegistry, setSDKUrl, setWorkerUrl, wat2wasm };
