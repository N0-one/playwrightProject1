import { Page, expect } from "@playwright/test"
import {NavigationPage} from '../page-objects/navigationPage'
import {FormLayoutsPage} from '../page-objects/formLayoutsPage'
import {DatepickerPage} from '../page-objects/datepickerPage'

export class PageManager{

    private readonly page: Page
    private readonly navigatonPage: NavigationPage
    private readonly formLayoutsPage: FormLayoutsPage
    private readonly datepickerPage: DatepickerPage

    constructor(page: Page){
        this.page = page
        this.navigatonPage = new NavigationPage(this.page)
        this.formLayoutsPage = new FormLayoutsPage(this.page)
        this.datepickerPage = new DatepickerPage(this.page)
    }

    navigateTo(){
        return this.navigatonPage
    }

    onFormLayoutsPage(){
        return this.formLayoutsPage
    }

    onDatepickerPage(){
        return this.datepickerPage
    }
}