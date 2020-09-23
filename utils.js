((global) => {
  let Utils = (() => {
    const sleep = (ms) => new Promise(
      resolve => setTimeout(resolve, ms)
    );

    // Async loop at a fixed interval
    const coroutine = (f, _ms, autostart) => {
      let loop = false;
      let ms = _ms ? _ms : 100;
      let idempotencyKey = 0;

      let run = async () => {
        f();
        await sleep(ms);
        if (loop) run();
      };

      let state = {
        // Start looping
        start: () => {
          if (!loop) {
            loop = true;
            run();
          }
        },
        // Stop the loop
        stop: () => {
          loop = false;
          idempotencyKey = (idempotencyKey+1) % Number.MAX_SAFE_INTEGER;
        },
        // Resume the loop, cannot fire more than once
        resume: async () => {
          let _idempotencyKey = idempotencyKey;
          await Utils.sleep(ms);
          if(_idempotencyKey == idempotencyKey) {
            state.start();
          }
        },
        // Call the function once, after the coroutine's delay
        once: async () => {
          let _idempotencyKey = idempotencyKey;
          await Utils.sleep(ms);
          if(_idempotencyKey == idempotencyKey) {
            f();
          }
        },
        // Update the current state
        setDirty: () => {
          idempotencyKey = (idempotencyKey+1) % Number.MAX_SAFE_INTEGER;
        }
      };

      if(autostart) state.start();

      return state;
    };

    return {
      sleep: sleep,
      coroutine: coroutine
    };
  })();

  global.Utils = Utils;
})( this );
