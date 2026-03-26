/*
 * stm32_hal_stub.c — STM32 HAL stub implementations
 * Each HAL function produces observable output via printf.
 * Compiled with candidate's main.c for STM32_HAL challenges.
 */
#include "stm32_hal_stub.h"
#include <string.h>
#include <unistd.h>

/* ── GPIO port instances ────────────────────────────────────── */
GPIO_TypeDef _hal_gpioa = {"PA", 0};
GPIO_TypeDef _hal_gpiob = {"PB", 0};
GPIO_TypeDef _hal_gpioc = {"PC", 0};

static uint32_t _tick = 0;
static uint32_t _adc_mock_val = 2048; /* Default mid-scale ADC reading */

/* Helper: port name */
static const char *_port_name(GPIO_TypeDef *g) {
  if (g == &_hal_gpioa)
    return "PA";
  if (g == &_hal_gpiob)
    return "PB";
  return "PC";
}

static int _pin_num(uint16_t pin) {
  for (int i = 0; i < 16; i++)
    if (pin & (1u << i))
      return i;
  return -1;
}

/* ── HAL Core ───────────────────────────────────────────────── */
void HAL_Init(void) {
  printf("[HAL] HAL_Init: system configured\n");
  fflush(stdout);
}

void HAL_Delay(uint32_t ms) {
  _tick += ms;
  printf("[HAL] HAL_Delay(%u ms) — tick=%u\n", ms, _tick);
  fflush(stdout);
}

uint32_t HAL_GetTick(void) { return _tick; }

/* ── RCC ────────────────────────────────────────────────────── */
void HAL_RCC_EnableClock_GPIOA(void) {
  printf("[RCC] GPIOA clock enabled\n");
  fflush(stdout);
}
void HAL_RCC_EnableClock_GPIOB(void) {
  printf("[RCC] GPIOB clock enabled\n");
  fflush(stdout);
}
void HAL_RCC_EnableClock_GPIOC(void) {
  printf("[RCC] GPIOC clock enabled\n");
  fflush(stdout);
}

/* ── GPIO ───────────────────────────────────────────────────── */
void HAL_GPIO_Init(GPIO_TypeDef *g, GPIO_InitTypeDef *init) {
  int pin = _pin_num((uint16_t)init->Pin);
  printf("[HAL] GPIO_Init: %s%d Mode=%lu Pull=%lu Speed=%lu\n", _port_name(g),
         pin, init->Mode, init->Pull, init->Speed);
  fflush(stdout);
}

void HAL_GPIO_WritePin(GPIO_TypeDef *g, uint16_t pin, GPIO_PinState state) {
  if (state == GPIO_PIN_SET)
    g->odr |= pin;
  else
    g->odr &= ~pin;
  printf("[HAL] GPIO_Write: %s%d = %s\n", _port_name(g), _pin_num(pin),
         state == GPIO_PIN_SET ? "HIGH" : "LOW");
  fflush(stdout);
}

GPIO_PinState HAL_GPIO_ReadPin(GPIO_TypeDef *g, uint16_t pin) {
  GPIO_PinState s = (g->odr & pin) ? GPIO_PIN_SET : GPIO_PIN_RESET;
  printf("[HAL] GPIO_Read: %s%d = %s\n", _port_name(g), _pin_num(pin),
         s == GPIO_PIN_SET ? "HIGH" : "LOW");
  fflush(stdout);
  return s;
}

void HAL_GPIO_TogglePin(GPIO_TypeDef *g, uint16_t pin) {
  g->odr ^= pin;
  printf("[HAL] GPIO_Toggle: %s%d → %s\n", _port_name(g), _pin_num(pin),
         (g->odr & pin) ? "HIGH" : "LOW");
  fflush(stdout);
}

/* ── UART ───────────────────────────────────────────────────── */
HAL_StatusTypeDef HAL_UART_Init(UART_HandleTypeDef *h) {
  printf("[HAL] UART_Init: baud=%lu\n", h->Init.BaudRate);
  fflush(stdout);
  return HAL_OK;
}

HAL_StatusTypeDef HAL_UART_Transmit(UART_HandleTypeDef *h, const uint8_t *data,
                                    uint16_t size, uint32_t timeout) {
  printf("[UART TX] %.*s\n", size, data);
  fflush(stdout);
  return HAL_OK;
}

HAL_StatusTypeDef HAL_UART_Receive(UART_HandleTypeDef *h, uint8_t *buf,
                                   uint16_t size, uint32_t timeout) {
  /* Simulate receiving "TEST\r\n" */
  const char *mock = "TEST\r\n";
  size_t len = size < 6 ? size : 6;
  memcpy(buf, mock, len);
  printf("[UART RX] %.*s\n", (int)len, buf);
  fflush(stdout);
  return HAL_OK;
}

/* ── Timer ──────────────────────────────────────────────────── */
HAL_StatusTypeDef HAL_TIM_Base_Init(TIM_HandleTypeDef *h) {
  printf("[HAL] TIM_Init: PSC=%lu ARR=%lu\n", h->Init.Prescaler,
         h->Init.Period);
  fflush(stdout);
  return HAL_OK;
}

HAL_StatusTypeDef HAL_TIM_Base_Start(TIM_HandleTypeDef *h) {
  printf("[HAL] TIM_Start\n");
  fflush(stdout);
  return HAL_OK;
}

HAL_StatusTypeDef HAL_TIM_Base_Stop(TIM_HandleTypeDef *h) {
  printf("[HAL] TIM_Stop\n");
  fflush(stdout);
  return HAL_OK;
}

uint32_t HAL_TIM_ReadCapturedValue(TIM_HandleTypeDef *h, uint32_t ch) {
  static uint32_t cnt = 0;
  return ++cnt * 100;
}

/* ── ADC ────────────────────────────────────────────────────── */
HAL_StatusTypeDef HAL_ADC_Init(ADC_HandleTypeDef *h) {
  printf("[HAL] ADC_Init\n");
  fflush(stdout);
  return HAL_OK;
}

HAL_StatusTypeDef HAL_ADC_Start(ADC_HandleTypeDef *h) {
  printf("[HAL] ADC_Start\n");
  fflush(stdout);
  return HAL_OK;
}

HAL_StatusTypeDef HAL_ADC_PollForConversion(ADC_HandleTypeDef *h,
                                            uint32_t timeout) {
  return HAL_OK;
}

uint32_t HAL_ADC_GetValue(ADC_HandleTypeDef *h) {
  printf("[HAL] ADC_GetValue = %u\n", (unsigned)_adc_mock_val);
  fflush(stdout);
  return _adc_mock_val;
}

/* ── I2C ────────────────────────────────────────────────────── */
HAL_StatusTypeDef HAL_I2C_Master_Transmit(I2C_HandleTypeDef *h, uint16_t addr,
                                          uint8_t *data, uint16_t size,
                                          uint32_t timeout) {
  printf("[I2C TX] addr=0x%02X data=%.*s\n", addr, size, data);
  fflush(stdout);
  return HAL_OK;
}

HAL_StatusTypeDef HAL_I2C_Master_Receive(I2C_HandleTypeDef *h, uint16_t addr,
                                         uint8_t *buf, uint16_t size,
                                         uint32_t timeout) {
  memset(buf, 0xAB, size);
  printf("[I2C RX] addr=0x%02X got %d bytes\n", addr, size);
  fflush(stdout);
  return HAL_OK;
}

/* ── SPI ────────────────────────────────────────────────────── */
HAL_StatusTypeDef HAL_SPI_Transmit(SPI_HandleTypeDef *h, uint8_t *data,
                                   uint16_t size, uint32_t timeout) {
  printf("[SPI TX] %d bytes: 0x%02X...\n", size, data[0]);
  fflush(stdout);
  return HAL_OK;
}

HAL_StatusTypeDef HAL_SPI_Receive(SPI_HandleTypeDef *h, uint8_t *buf,
                                  uint16_t size, uint32_t timeout) {
  memset(buf, 0xFF, size);
  printf("[SPI RX] %d bytes\n", size);
  fflush(stdout);
  return HAL_OK;
}
