import {test, expect} from '@playwright/test'

test.describe.configure({mode: 'parallel'})

test.beforeEach(async({page}, testInfo) => {
    await page.goto('/')
})

test.describe.parallel('Form Layouts page @block', () => {

    test.describe.configure({retries: 0})
    //test.describe.configure({mode: 'serial'})


    test.beforeEach(async({page}) => {
        await page.goto('/')
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })



    test('input Fields', async({page}, testInfo) => {
        if(testInfo.retry){
            //do something
        }

        const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', { name:'Email' })

        await usingTheGridEmailInput.fill('test@test.com')
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially('test2@test.com')

        //generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toEqual('test2@test.com')

        //locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com')
    })

    test.only('radio buttons', async({page}) => {
        const usingTheGridForm = page.locator('nb-card', {hasText: "Using the Grid"})
        
        //await usingTheGridForm.getByLabel('Option 1').check({force:true})
        await usingTheGridForm.getByRole('radio', {name: "Option 1"}).check({force:true})

        //generic assertion
        const radioStatus = await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()
       
        await expect(usingTheGridForm).toHaveScreenshot({maxDiffPixels: 150})

       
        // expect(radioStatus).toBeTruthy()

        // //locator assertion
        // await expect(usingTheGridForm.getByRole('radio', {name: "Option 1"})).toBeChecked()

        //Option 2 select
        // await usingTheGridForm.getByRole('radio', {name: "Option 2"}).check({force:true})

        // //generic assertion
        // expect(await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()).toBeFalsy()
        // expect(await usingTheGridForm.getByRole('radio', {name: "Option 2"}).isChecked()).toBeTruthy()
    })

})

test('checkboxes', async({page}) => {
        await page.getByText('Modal & Overlays').click()
        await page.getByText('Toastr').click()

        const hideOnClickCheckbox = page.getByRole('checkbox', {name:"Hide on click"})
        await hideOnClickCheckbox.uncheck({force:true})

        //generic assertion
        const hideOnClickCheckboxValue = await hideOnClickCheckbox.isChecked()
        expect(hideOnClickCheckboxValue).toBeFalsy()

        //locator assertion
        //await expect(prevenDuplicateCheckbox)

        const prevenDuplicateCheckbox = page.getByRole('checkbox', {name:"Prevent arising of duplicate toast"})
        await prevenDuplicateCheckbox.check({force:true})

        //generic assertion
        const preventDuplicateCheckboxValue = await prevenDuplicateCheckbox.isChecked()
        expect(preventDuplicateCheckboxValue).toBeTruthy()


        //all checkboes uncheck/check
        const allCheckBoxes = page.getByRole('checkbox')

        for(const box of await allCheckBoxes.all()){
            await box.uncheck({force:true})
            expect(await box.isChecked()).toBeFalsy()
        }
        
})

test('lists and dropdowns', async({page}) => {

    const themeButton = page.locator('ngx-header nb-select')
    await themeButton.click()

    page.getByRole('list') //when the list has a UL tag
    page.getByRole('listitem') //when the list has LI tag

    //const optionList = page.getByRole('list').locator('nb-option')
    const optionList = page.locator('nb-option-list nb-option')
    await expect(optionList).toHaveText(['Light','Dark','Cosmic','Corporate'])

    await optionList.filter({hasText: 'Cosmic'}).click()

    //validating color change
    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    }

    for(const color in colors){
        await themeButton.click()
        await optionList.filter({hasText: color}).click()
        await expect(header).toHaveCSS('background-color', colors[color])
    }

})

test('tooltips', async({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()

    const tooltipCard = page.locator('nb-card', {hasText: 'Tooltip Placements'})
    await tooltipCard.getByRole('button', {name: 'TOP'}).hover()

    page.getByRole('tooltip') //if you have a role tooltip created
    const tooltip = await page.locator('nb-tooltip').textContent()
    expect(tooltip).toEqual('This is a tooltip')
})

test('dialog box', async({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    })

    await page.getByRole('table').locator('tr', {hasText: 'mdo@gmail.com'}).locator('.nb-trash').click()

    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')
})

test('web tables', async({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    //1 get the row by any test in this row
    const targetRow = page.getByRole('row',{name: 'twitter@outlook.com'})
    await targetRow.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('Age').clear()
    await page.locator('input-editor').getByPlaceholder('Age').fill("45")
    await page.locator('.nb-checkmark').click()

    //2 get the row based on the value in the specific column
    //const pageNumberList = page.locator('ng2-smart-table-pager')
    //await pageNumberList.locator('li', {hasText: "2"}).click()
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click()

    const targetRowById = page.getByRole('row', {name:"11"}).filter({has: page.locator('td').nth(1).getByText('11')})
    await targetRowById.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill("test@test.com")
    await page.locator('.nb-checkmark').click()
    await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')

    //3 test filter of the table
    const ages = ["20", "30", "40", "200"]

    for( let age of ages){
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)
        await page.waitForTimeout(500)

        const rows = page.locator('tbody tr')
        for( let row of await rows.all()){
            const cellValue = await row.locator('td').last().textContent()
            
            if(age == "200"){
                expect(await page.getByRole('table').textContent()).toContain("No data found")
            }
            else{
                expect(cellValue).toEqual(age)
            }
            
        }
    }
})


test('datepicker', async({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click()

    let date = new Date()
    date.setDate(date.getDate() + 7)
    const expectedDate = date.getDate().toString()
    const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'})
    const expectedMonthLong= date.toLocaleString('En-US', {month: 'long'})
    const expectedYear = date.getFullYear()
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`
    const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `

    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }

    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact:true}).click()
    await expect(calendarInputField).toHaveValue(dateToAssert)
})


test('sliders', async({page}) => {
    //Update attribute
    // const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    // await tempGauge.evaluate( node => {
    //     node.setAttribute('cx', '232.630')
    //     node.setAttribute('cy', '232.630')
    // })
    // await tempGauge.click()

    //Mouse movement
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded()

    const box = await tempBox.boundingBox()
    const x = box.x + box.width / 2
    const y = box.y + box.height / 2
    await page.mouse.move(x, y)
    await page.mouse.down()
    await page.mouse.move(x+100, y)
    await page.mouse.move(x+100, y+100)
    await page.mouse.up()

    await expect(tempBox).toContainText('30')

})
