/*
 * FreeRTOSConfig.h — VirtualLab FreeRTOS POSIX configuration
 * Used with the FreeRTOS-Kernel POSIX/Linux port.
 * Candidates should not need to modify this file.
 */
#ifndef FREERTOS_CONFIG_H
#define FREERTOS_CONFIG_H

/* ── Scheduler ───────────────────────────────────────────────── */
#define configUSE_PREEMPTION 1
#define configUSE_TIME_SLICING 1
#define configUSE_PORT_OPTIMISED_TASK_SELECTION 0
#define configUSE_TICKLESS_IDLE 0

/* ── Tick rate ───────────────────────────────────────────────── */
#define configTICK_RATE_HZ ((TickType_t)1000)
#define configCPU_CLOCK_HZ ((unsigned long)72000000)

/* ── Task stack & priority ───────────────────────────────────── */
#define configMINIMAL_STACK_SIZE ((uint16_t)256)
#define configMAX_PRIORITIES 10
#define configMAX_TASK_NAME_LEN 20

/* ── Memory ──────────────────────────────────────────────────── */
#define configTOTAL_HEAP_SIZE ((size_t)(64 * 1024))
#define configSUPPORT_DYNAMIC_ALLOCATION 1
#define configSUPPORT_STATIC_ALLOCATION 0

/* ── Features ────────────────────────────────────────────────── */
#define configUSE_MUTEXES 1
#define configUSE_RECURSIVE_MUTEXES 1
#define configUSE_COUNTING_SEMAPHORES 1
#define configUSE_QUEUE_SETS 1
#define configUSE_TASK_NOTIFICATIONS 1
#define configUSE_STREAM_BUFFERS 1

/* ── Software timers ─────────────────────────────────────────── */
#define configUSE_TIMERS 1
#define configTIMER_TASK_PRIORITY (configMAX_PRIORITIES - 1)
#define configTIMER_QUEUE_LENGTH 10
#define configTIMER_TASK_STACK_DEPTH (configMINIMAL_STACK_SIZE * 2)

/* ── Event groups ────────────────────────────────────────────── */
/* Event groups included via event_groups.c — no extra flag needed */

/* ── Trace & debug ───────────────────────────────────────────── */
#define configUSE_TRACE_FACILITY 1
#define configUSE_STATS_FORMATTING_FUNCTIONS 1
#define configGENERATE_RUN_TIME_STATS 0

/* ── Co-routine (not used) ───────────────────────────────────── */
#define configUSE_CO_ROUTINES 0
#define configMAX_CO_ROUTINE_PRIORITIES 1

/* ── API includes ────────────────────────────────────────────── */
#define INCLUDE_vTaskDelay 1
#define INCLUDE_vTaskDelayUntil 1
#define INCLUDE_uxTaskPriorityGet 1
#define INCLUDE_vTaskPrioritySet 1
#define INCLUDE_vTaskDelete 1
#define INCLUDE_vTaskSuspend 1
#define INCLUDE_xTaskGetCurrentTaskHandle 1
#define INCLUDE_xTaskGetHandle 1
#define INCLUDE_xTimerPendFunctionCall 1
#define INCLUDE_xSemaphoreGetMutexHolder 1
#define INCLUDE_xTaskGetSchedulerState 1

/* ── POSIX port specifics ────────────────────────────────────── */
#define configUSE_POSIX_ERRNO 1

/* Assertion handler: print and abort */
#define configASSERT(x)                                                        \
  if ((x) == 0) {                                                              \
    fprintf(stderr, "[FreeRTOS] ASSERT failed: %s:%d\n", __FILE__, __LINE__);  \
    fflush(stderr);                                                            \
    abort();                                                                   \
  }

#endif /* FREERTOS_CONFIG_H */
