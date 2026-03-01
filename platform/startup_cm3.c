/* startup_cm3.c — Minimal Cortex-M3 startup for QEMU lm3s6965evb
 * Auto-injected by VirtualLab alongside candidate main.c.
 * Provides: vector table, reset handler, BSS clear, calls main().
 */
#include <stdint.h>

extern int main(void);
extern void __libc_init_array(void);

/* Linker symbols */
extern uint32_t _sidata; /* Start of .data in flash */
extern uint32_t _sdata;  /* Start of .data in RAM */
extern uint32_t _edata;  /* End of .data in RAM */
extern uint32_t _sbss;   /* Start of .bss */
extern uint32_t _ebss;   /* End of .bss */
extern uint32_t _estack; /* Initial stack pointer */

void Reset_Handler(void) {
  /* Copy .data section from flash to RAM */
  uint32_t *src = &_sidata;
  uint32_t *dst = &_sdata;
  while (dst < &_edata)
    *dst++ = *src++;

  /* Zero .bss */
  dst = &_sbss;
  while (dst < &_ebss)
    *dst++ = 0;

  /* Call static constructors */
  __libc_init_array();

  /* Call candidate's main */
  main();

  /* Trigger semihosting exit via newlib */
  extern void _exit(int status);
  _exit(0);

  /* Fallback hang if exit fails */
  while (1) {
  }
}

void Default_Handler(void) {
  /* Exit with error code 1 on CPU faults */
  extern void _exit(int status);
  _exit(1);
}

/* Minimal ISR aliases */
void NMI_Handler(void) __attribute__((weak, alias("Default_Handler")));
void HardFault_Handler(void) __attribute__((weak, alias("Default_Handler")));
void SVC_Handler(void) __attribute__((weak, alias("Default_Handler")));
void PendSV_Handler(void) __attribute__((weak, alias("Default_Handler")));
void SysTick_Handler(void) __attribute__((weak, alias("Default_Handler")));

/* Vector table — placed at .isr_vector section */
__attribute__((section(".isr_vector"),
               used)) void (*const vector_table[])(void) = {
    (void (*)(void))((uint32_t)&_estack), /* 0: Initial SP */
    Reset_Handler,                        /* 1: Reset */
    NMI_Handler,                          /* 2: NMI */
    HardFault_Handler,                    /* 3: HardFault */
    Default_Handler,                      /* 4: MemManage */
    Default_Handler,                      /* 5: BusFault */
    Default_Handler,                      /* 6: UsageFault */
    0,
    0,
    0,
    0,               /* 7-10: Reserved */
    SVC_Handler,     /* 11: SVCall */
    Default_Handler, /* 12: Debug */
    0,               /* 13: Reserved */
    PendSV_Handler,  /* 14: PendSV */
    SysTick_Handler, /* 15: SysTick */
};
