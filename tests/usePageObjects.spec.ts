import {test, expect} from '@playwright/test'
import {PageManager} from '../page-objects/pageManager'
import {faker} from '@faker-js/faker'


test.beforeEach(async({page}, testInfo) => {
    await page.goto('/')
})

test('navigate to form page @smoke @regression', async({page}) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datepickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
})

test('parameterized methods @smoke', async({page}) => {
        const pm = new PageManager(page)
        const randomFullName = faker.person.fullName()
        const randomEmail = `${randomFullName.replace(' ','')}${faker.number.int(1000)}@test.com`

        await pm.navigateTo().formLayoutsPage()
        await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.TESTUSERNAME, process.env.TESTPASSWORD, 'Option 2')
        await page.screenshot({path: 'screenshots/formLayoutsPage.png'})
        const buffer = await page.screenshot()
        console.log(buffer.toString('base64'))

        await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)
        await page.locator('nb-card', {hasText: "Inline form"}).screenshot({path: 'screenshots/inlineForm.png'})

         await pm.navigateTo().datepickerPage()
         await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(10)
         await pm.onDatepickerPage().selectDatepickerWithRangeFromToday(6, 20)
})

test.only('testing with argos ci', async({page}) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datepickerPage()
})