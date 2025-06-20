import {test, expect} from '@playwright/test'

test.beforeEach(async({page}, testInfo) => {
    await page.goto(process.env.URL)
    await page.getByText('Button Triggering AJAX Request').click()
    testInfo.setTimeout(testInfo.timeout + 5000)
})

test('auto waiting', async({page}) => {
    const successButton = page.locator('.bg-success')

    //await successButton.click()

    //const successText = await successButton.textContent()

    //await successButton.waitFor({state: "attached"})
    //const successText = await successButton.allTextContents()
    //expect(successText).toContain('Data loaded with AJAX get request.')

    await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000})
})

test.skip('alternative waits', async({page}) => {
    const successButton = page.locator('.bg-success')

    //_____ wait for element
    //await page.waitForSelector('.bg-success')

    //_____ wait for particular response
    //await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    //__ wait for network calls to be completed ('Not recommended)
    await page.waitForLoadState('networkidle')

    await page.waitForTimeout(5000)

    const successText = await successButton.allTextContents()
    expect(successText).toContain('Data loaded with AJAX get request.')

})

test.skip('timeouts', async({page}) => {
        //test.setTimeout(10000)
        test.slow()
        const successButton = page.locator('.bg-success')
        await successButton.click({timeout: 16000})
})