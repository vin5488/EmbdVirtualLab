/*
 * stm32_hal_stub.h — STM32 HAL type definitions and function prototypes
 * Auto-injected by VirtualLab for STM32_HAL challenges.
 * Mirrors the real STM32 HAL API so candidate code compiles unchanged.
 */
#ifndef STM32_HAL_STUB_H
#define STM32_HAL_STUB_H

#include <stddef.h>
#include <stdint.h>
#include <stdio.h>


/* ── Common Types ───────────────────────────────────────────── */
typedef enum {
  HAL_OK = 0x00U,
  HAL_ERROR = 0x01U,
  HAL_BUSY = 0x02U,
  HAL_TIMEOUT = 0x03U
} HAL_StatusTypeDef;
typedef enum { RESET = 0, SET = !RESET } FlagStatus, ITStatus, BitStatus;
typedef enum { DISABLE = 0, ENABLE = !DISABLE } FunctionalState;
typedef enum { GPIO_PIN_RESET = 0, GPIO_PIN_SET } GPIO_PinState;

/* ── GPIO ───────────────────────────────────────────────────── */
#define GPIO_PIN_0 ((uint16_t)0x0001U)
#define GPIO_PIN_1 ((uint16_t)0x0002U)
#define GPIO_PIN_2 ((uint16_t)0x0004U)
#define GPIO_PIN_3 ((uint16_t)0x0008U)
#define GPIO_PIN_4 ((uint16_t)0x0010U)
#define GPIO_PIN_5 ((uint16_t)0x0020U)
#define GPIO_PIN_6 ((uint16_t)0x0040U)
#define GPIO_PIN_7 ((uint16_t)0x0080U)
#define GPIO_PIN_8 ((uint16_t)0x0100U)
#define GPIO_PIN_9 ((uint16_t)0x0200U)
#define GPIO_PIN_10 ((uint16_t)0x0400U)
#define GPIO_PIN_11 ((uint16_t)0x0800U)
#define GPIO_PIN_12 ((uint16_t)0x1000U)
#define GPIO_PIN_13 ((uint16_t)0x2000U)
#define GPIO_PIN_14 ((uint16_t)0x4000U)
#define GPIO_PIN_15 ((uint16_t)0x8000U)
#define GPIO_PIN_All ((uint16_t)0xFFFFU)

#define GPIO_MODE_OUTPUT_PP 0x00000001U
#define GPIO_MODE_INPUT 0x00000000U
#define GPIO_MODE_AF_PP 0x00000002U
#define GPIO_PULLDOWN 0x00000002U
#define GPIO_PULLUP 0x00000001U
#define GPIO_NOPULL 0x00000000U
#define GPIO_SPEED_FREQ_HIGH 0x00000003U

typedef struct {
  uint32_t Pin, Mode, Pull, Speed, Alternate;
} GPIO_InitTypeDef;

/* Stub: GPIO ports are identified by name */
typedef struct {
  char name[4];
  uint16_t odr;
} GPIO_TypeDef;
extern GPIO_TypeDef _hal_gpioa, _hal_gpiob, _hal_gpioc;
#define GPIOA (&_hal_gpioa)
#define GPIOB (&_hal_gpiob)
#define GPIOC (&_hal_gpioc)

/* ── UART ───────────────────────────────────────────────────── */
#define UART_MODE_TX_RX 0x00000003U
#define UART_STOPBITS_1 0x00000000U
#define UART_PARITY_NONE 0x00000000U
#define UART_WORDLENGTH_8B 0x00000000U
#define UART_OVERSAMPLING_16 0x00000000U

typedef struct {
  uint32_t BaudRate, WordLength, StopBits, Parity, Mode, HwFlowCtl,
      OverSampling;
} UART_InitTypeDef;

typedef struct {
  void *Instance;
  UART_InitTypeDef Init;
} UART_HandleTypeDef;

/* ── Timer ──────────────────────────────────────────────────── */
#define TIM_COUNTERMODE_UP 0x00000000U
#define TIM_CLOCKDIVISION_DIV1 0x00000000U
#define TIM_AUTORELOAD_PRELOAD_DISABLE 0x00000000U
typedef struct {
  uint32_t Prescaler, CounterMode, Period, ClockDivision, RepetitionCounter,
      AutoReloadPreload;
} TIM_Base_InitTypeDef;
typedef struct {
  void *Instance;
  TIM_Base_InitTypeDef Init;
} TIM_HandleTypeDef;

/* ── ADC ────────────────────────────────────────────────────── */
#define ADC_RESOLUTION_12B 0x00000000U
#define ADC_DATAALIGN_RIGHT 0x00000000U
#define ADC_EXTERNALTRIGCONV_T1_CC1 0x00000000U
typedef struct {
  uint32_t DataAlign, ScanConvMode, ContinuousConvMode, NbrOfConversion,
      ExternalTrigConv;
} ADC_InitTypeDef;
typedef struct {
  void *Instance;
  ADC_InitTypeDef Init;
} ADC_HandleTypeDef;

/* ── I2C ────────────────────────────────────────────────────── */
typedef struct {
  void *Instance;
} I2C_HandleTypeDef;
/* ── SPI ────────────────────────────────────────────────────── */
typedef struct {
  void *Instance;
} SPI_HandleTypeDef;

/* ── HAL Function Prototypes ────────────────────────────────── */
void HAL_Init(void);
void HAL_Delay(uint32_t Delay);
uint32_t HAL_GetTick(void);

/* GPIO */
void HAL_GPIO_Init(GPIO_TypeDef *GPIOx, GPIO_InitTypeDef *GPIO_Init);
void HAL_GPIO_WritePin(GPIO_TypeDef *GPIOx, uint16_t GPIO_Pin,
                       GPIO_PinState PinState);
GPIO_PinState HAL_GPIO_ReadPin(GPIO_TypeDef *GPIOx, uint16_t GPIO_Pin);
void HAL_GPIO_TogglePin(GPIO_TypeDef *GPIOx, uint16_t GPIO_Pin);

/* UART */
HAL_StatusTypeDef HAL_UART_Init(UART_HandleTypeDef *huart);
HAL_StatusTypeDef HAL_UART_Transmit(UART_HandleTypeDef *huart,
                                    const uint8_t *pData, uint16_t Size,
                                    uint32_t Timeout);
HAL_StatusTypeDef HAL_UART_Receive(UART_HandleTypeDef *huart, uint8_t *pData,
                                   uint16_t Size, uint32_t Timeout);

/* Timer */
HAL_StatusTypeDef HAL_TIM_Base_Init(TIM_HandleTypeDef *htim);
HAL_StatusTypeDef HAL_TIM_Base_Start(TIM_HandleTypeDef *htim);
HAL_StatusTypeDef HAL_TIM_Base_Stop(TIM_HandleTypeDef *htim);
uint32_t HAL_TIM_ReadCapturedValue(TIM_HandleTypeDef *htim, uint32_t Channel);

/* ADC */
HAL_StatusTypeDef HAL_ADC_Init(ADC_HandleTypeDef *hadc);
HAL_StatusTypeDef HAL_ADC_Start(ADC_HandleTypeDef *hadc);
HAL_StatusTypeDef HAL_ADC_PollForConversion(ADC_HandleTypeDef *hadc,
                                            uint32_t Timeout);
uint32_t HAL_ADC_GetValue(ADC_HandleTypeDef *hadc);

/* I2C */
HAL_StatusTypeDef HAL_I2C_Master_Transmit(I2C_HandleTypeDef *hi2c,
                                          uint16_t DevAddress, uint8_t *pData,
                                          uint16_t Size, uint32_t Timeout);
HAL_StatusTypeDef HAL_I2C_Master_Receive(I2C_HandleTypeDef *hi2c,
                                         uint16_t DevAddress, uint8_t *pData,
                                         uint16_t Size, uint32_t Timeout);

/* SPI */
HAL_StatusTypeDef HAL_SPI_Transmit(SPI_HandleTypeDef *hspi, uint8_t *pData,
                                   uint16_t Size, uint32_t Timeout);
HAL_StatusTypeDef HAL_SPI_Receive(SPI_HandleTypeDef *hspi, uint8_t *pData,
                                  uint16_t Size, uint32_t Timeout);

/* RCC */
void HAL_RCC_EnableClock_GPIOA(void);
void HAL_RCC_EnableClock_GPIOB(void);
void HAL_RCC_EnableClock_GPIOC(void);

#define __HAL_RCC_GPIOA_CLK_ENABLE() HAL_RCC_EnableClock_GPIOA()
#define __HAL_RCC_GPIOB_CLK_ENABLE() HAL_RCC_EnableClock_GPIOB()
#define __HAL_RCC_GPIOC_CLK_ENABLE() HAL_RCC_EnableClock_GPIOC()
#define __HAL_RCC_TIM2_CLK_ENABLE() printf("[RCC] TIM2 clock enabled\n")
#define __HAL_RCC_ADC1_CLK_ENABLE() printf("[RCC] ADC1 clock enabled\n")
#define __HAL_RCC_USART1_CLK_ENABLE() printf("[RCC] USART1 clock enabled\n")
#define __HAL_RCC_I2C1_CLK_ENABLE() printf("[RCC] I2C1 clock enabled\n")
#define __HAL_RCC_SPI1_CLK_ENABLE() printf("[RCC] SPI1 clock enabled\n")

#endif /* STM32_HAL_STUB_H */
