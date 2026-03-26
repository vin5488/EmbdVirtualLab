/*
 * stm32f1xx_sim.h — Minimal STM32F103 peripheral register definitions
 * Auto-injected by VirtualLab for STM32_SIM (register-direct) challenges.
 * Based on STM32F103 Reference Manual (RM0008).
 */
#ifndef STM32F1XX_SIM_H
#define STM32F1XX_SIM_H

#include <stdint.h>
#include <stdio.h>

/* ── Base Addresses ─────────────────────────────────────────── */
#define PERIPH_BASE     0x40000000UL
#define APB1PERIPH_BASE PERIPH_BASE
#define APB2PERIPH_BASE (PERIPH_BASE + 0x10000UL)
#define AHBPERIPH_BASE  (PERIPH_BASE + 0x20000UL)

#define RCC_BASE        (AHBPERIPH_BASE + 0x1000UL)
#define GPIOA_BASE      (APB2PERIPH_BASE + 0x0800UL)
#define GPIOB_BASE      (APB2PERIPH_BASE + 0x0C00UL)
#define GPIOC_BASE      (APB2PERIPH_BASE + 0x1000UL)
#define GPIOD_BASE      (APB2PERIPH_BASE + 0x1400UL)
#define TIM1_BASE       (APB2PERIPH_BASE + 0x2C00UL)
#define TIM2_BASE       (APB1PERIPH_BASE + 0x0000UL)
#define TIM3_BASE       (APB1PERIPH_BASE + 0x0400UL)
#define USART1_BASE     (APB2PERIPH_BASE + 0x3800UL)
#define USART2_BASE     (APB1PERIPH_BASE + 0x4400UL)
#define ADC1_BASE       (APB2PERIPH_BASE + 0x2400UL)
#define SPI1_BASE       (APB2PERIPH_BASE + 0x3000UL)
#define I2C1_BASE       (APB1PERIPH_BASE + 0x5400UL)
#define EXTI_BASE       (APB2PERIPH_BASE + 0x0400UL)
#define FLASH_R_BASE    (AHBPERIPH_BASE + 0x2000UL)
#define SYSTICK_BASE    0xE000E010UL

/* ── Peripheral Structs ─────────────────────────────────────── */
typedef struct {
    volatile uint32_t CR;       /*!< RCC clock control register */
    volatile uint32_t CFGR;     /*!< RCC clock configuration register */
    volatile uint32_t CIR;      /*!< RCC clock interrupt register */
    volatile uint32_t APB2RSTR; /*!< APB2 peripheral reset register */
    volatile uint32_t APB1RSTR; /*!< APB1 peripheral reset register */
    volatile uint32_t AHBENR;   /*!< AHB peripheral clock enable register */
    volatile uint32_t APB2ENR;  /*!< APB2 peripheral clock enable register */
    volatile uint32_t APB1ENR;  /*!< APB1 peripheral clock enable register */
    volatile uint32_t BDCR;     /*!< Backup domain control register */
    volatile uint32_t CSR;      /*!< Control/status register */
} RCC_TypeDef;

typedef struct {
    volatile uint32_t CRL;  /*!< Port configuration register low */
    volatile uint32_t CRH;  /*!< Port configuration register high */
    volatile uint32_t IDR;  /*!< Port input data register */
    volatile uint32_t ODR;  /*!< Port output data register */
    volatile uint32_t BSRR; /*!< Port bit set/reset register */
    volatile uint32_t BRR;  /*!< Port bit reset register */
    volatile uint32_t LCKR; /*!< Port configuration lock register */
} GPIO_TypeDef;

typedef struct {
    volatile uint32_t CR1;  /*!< TIM control register 1 */
    volatile uint32_t CR2;  /*!< TIM control register 2 */
    volatile uint32_t SMCR; /*!< TIM slave mode control register */
    volatile uint32_t DIER; /*!< TIM DMA/interrupt enable register */
    volatile uint32_t SR;   /*!< TIM status register */
    volatile uint32_t EGR;  /*!< TIM event generation register */
    volatile uint32_t CCMR1;
    volatile uint32_t CCMR2;
    volatile uint32_t CCER;
    volatile uint32_t CNT;  /*!< TIM counter register */
    volatile uint32_t PSC;  /*!< TIM prescaler */
    volatile uint32_t ARR;  /*!< TIM auto-reload register */
    volatile uint32_t RCR;
    volatile uint32_t CCR1; /*!< TIM capture/compare register 1 */
    volatile uint32_t CCR2;
    volatile uint32_t CCR3;
    volatile uint32_t CCR4;
} TIM_TypeDef;

typedef struct {
    volatile uint32_t SR;   /*!< USART status register */
    volatile uint32_t DR;   /*!< USART data register */
    volatile uint32_t BRR;  /*!< USART baud rate register */
    volatile uint32_t CR1;  /*!< USART control register 1 */
    volatile uint32_t CR2;
    volatile uint32_t CR3;
    volatile uint32_t GTPR;
} USART_TypeDef;

typedef struct {
    volatile uint32_t SR;   /*!< ADC status register */
    volatile uint32_t CR1;  /*!< ADC control register 1 */
    volatile uint32_t CR2;  /*!< ADC control register 2 */
    volatile uint32_t SMPR1;
    volatile uint32_t SMPR2;
    volatile uint32_t JOFR1, JOFR2, JOFR3, JOFR4;
    volatile uint32_t HTR, LTR;
    volatile uint32_t SQR1, SQR2, SQR3;
    volatile uint32_t JSQR;
    volatile uint32_t JDR1, JDR2, JDR3, JDR4;
    volatile uint32_t DR;   /*!< ADC regular data register */
} ADC_TypeDef;

typedef struct {
    volatile uint32_t EXTI_IMR;
    volatile uint32_t EXTI_EMR;
    volatile uint32_t EXTI_RTSR;
    volatile uint32_t EXTI_FTSR;
    volatile uint32_t EXTI_SWIER;
    volatile uint32_t EXTI_PR;
} EXTI_TypeDef;

typedef struct {
    volatile uint32_t CTRL;   /*!< SysTick control and status */
    volatile uint32_t LOAD;   /*!< SysTick reload value */
    volatile uint32_t VAL;    /*!< SysTick current value */
    volatile uint32_t CALIB;
} SysTick_TypeDef;

/* ── Peripheral Pointers ────────────────────────────────────── */
/* In simulation, these map to local memory for exercises */
static RCC_TypeDef    _sim_rcc;
static GPIO_TypeDef   _sim_gpioa, _sim_gpiob, _sim_gpioc;
static TIM_TypeDef    _sim_tim2, _sim_tim3;
static USART_TypeDef  _sim_usart1;
static ADC_TypeDef    _sim_adc1;
static EXTI_TypeDef   _sim_exti;
static SysTick_TypeDef _sim_systick;

#define RCC     (&_sim_rcc)
#define GPIOA   (&_sim_gpioa)
#define GPIOB   (&_sim_gpiob)
#define GPIOC   (&_sim_gpioc)
#define TIM2    (&_sim_tim2)
#define TIM3    (&_sim_tim3)
#define USART1  (&_sim_usart1)
#define ADC1    (&_sim_adc1)
#define EXTI    (&_sim_exti)
#define SysTick (&_sim_systick)

/* ── RCC APB2ENR Bit Definitions ────────────────────────────── */
#define RCC_APB2ENR_IOPAEN  (1UL << 2)
#define RCC_APB2ENR_IOPBEN  (1UL << 3)
#define RCC_APB2ENR_IOPCEN  (1UL << 4)
#define RCC_APB2ENR_TIM1EN  (1UL << 11)
#define RCC_APB2ENR_USART1EN (1UL << 14)
#define RCC_APB2ENR_ADC1EN  (1UL << 9)
#define RCC_APB1ENR_TIM2EN  (1UL << 0)
#define RCC_APB1ENR_TIM3EN  (1UL << 1)
#define RCC_APB1ENR_USART2EN (1UL << 17)

/* ── GPIO Mode Definitions ──────────────────────────────────── */
#define GPIO_MODE_OUTPUT_PP  0x01U  /* Push-pull output, 10MHz */
#define GPIO_MODE_INPUT      0x04U  /* Floating input */
#define GPIO_PIN_0   (1U << 0)
#define GPIO_PIN_1   (1U << 1)
#define GPIO_PIN_4   (1U << 4)
#define GPIO_PIN_5   (1U << 5)
#define GPIO_PIN_13  (1U << 13)

/* ── ADC Bits ───────────────────────────────────────────────── */
#define ADC_CR2_ADON    (1UL << 0)
#define ADC_CR2_CAL     (1UL << 2)
#define ADC_CR2_SWSTART (1UL << 22)
#define ADC_SR_EOC      (1UL << 1)

/* ── TIM Bits ───────────────────────────────────────────────── */
#define TIM_CR1_CEN     (1UL << 0)
#define TIM_SR_UIF      (1UL << 0)
#define TIM_DIER_UIE    (1UL << 0)

/* ── USART Bits ─────────────────────────────────────────────── */
#define USART_SR_TXE    (1UL << 7)
#define USART_SR_RXNE   (1UL << 5)
#define USART_CR1_UE    (1UL << 13)
#define USART_CR1_TE    (1UL << 3)
#define USART_CR1_RE    (1UL << 2)

#endif /* STM32F1XX_SIM_H */
