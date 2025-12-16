<script>
import highlightjs from '@/components/plugins/Highlightjs.vue'
import navscrollto from '@/components/app/NavScrollTo.vue'
import axios from 'axios'
import { ScrollSpy } from 'bootstrap'

export default {
  components: {
    highlightjs: highlightjs,
    navScrollTo: navscrollto,
  },
  data() {
    return {
      code1: '',
      code2: '',
      code3: '',
      code4: '',
      code5: '',
      code6: '',
      code7: '',
      code8: '',
      code9: '',
      code10: '',
      code11: '',
      code12: '',
      code13: '',
      code14: '',
    }
  },
  mounted() {
    axios.get('/assets/data/form/element-code-1.json').then((response) => {
      this.code1 = response.data
    })
    axios.get('/assets/data/form/element-code-2.json').then((response) => {
      this.code2 = response.data
    })
    axios.get('/assets/data/form/element-code-3.json').then((response) => {
      this.code3 = response.data
    })
    axios.get('/assets/data/form/element-code-4.json').then((response) => {
      this.code4 = response.data
    })
    axios.get('/assets/data/form/element-code-5.json').then((response) => {
      this.code5 = response.data
    })
    axios.get('/assets/data/form/element-code-6.json').then((response) => {
      this.code6 = response.data
    })
    axios.get('/assets/data/form/element-code-7.json').then((response) => {
      this.code7 = response.data
    })
    axios.get('/assets/data/form/element-code-8.json').then((response) => {
      this.code8 = response.data
    })
    axios.get('/assets/data/form/element-code-9.json').then((response) => {
      this.code9 = response.data
    })
    axios.get('/assets/data/form/element-code-10.json').then((response) => {
      this.code10 = response.data
    })
    axios.get('/assets/data/form/element-code-11.json').then((response) => {
      this.code11 = response.data
    })
    axios.get('/assets/data/form/element-code-12.json').then((response) => {
      this.code12 = response.data
    })
    axios.get('/assets/data/form/element-code-13.json').then((response) => {
      this.code13 = response.data
    })
    axios.get('/assets/data/form/element-code-14.json').then((response) => {
      this.code14 = response.data
    })

    new ScrollSpy(document.body, {
      target: '#sidebar-bootstrap',
      offset: 200,
    })
  },
}
</script>
<template>
  <!-- BEGIN container -->
  <div class="container">
    <!-- BEGIN row -->
    <div class="row justify-content-center">
      <!-- BEGIN col-10 -->
      <div class="col-xl-10">
        <!-- BEGIN row -->
        <div class="row">
          <!-- BEGIN col-9 -->
          <div class="col-xl-9">
            <ul class="breadcrumb">
              <li class="breadcrumb-item"><a href="#">FORMS</a></li>
              <li class="breadcrumb-item active">FORM ELEMENTS</li>
            </ul>

            <h1 class="page-header">Form Elements <small>page header description goes here...</small></h1>

            <hr class="mb-4" />

            <!-- BEGIN #formControls -->
            <div id="formControls" class="mb-5">
              <h4>Form controls</h4>
              <p>
                Textual form controls—like <code>&lt;input&gt;</code>s, <code>&lt;select&gt;</code>s, and
                <code>&lt;textarea&gt;</code>s—are styled with the .form-control class. Included are styles for general
                appearance, focus state, sizing, and more. Please read the
                <a href="https://getbootstrap.com/docs/5.3/forms/form-control/" target="_blank"
                  >official Bootstrap documentation</a
                >
                for the full list of options.
              </p>
              <Card>
                <CardBody class="pb-2">
                  <form>
                    <div class="row">
                      <div class="col-xl-6">
                        <div class="form-group mb-3">
                          <label class="form-label" for="exampleFormControlInput1">Text input</label>
                          <input
                            id="exampleFormControlInput1"
                            type="email"
                            class="form-control"
                            placeholder="name@example.com"
                          />
                        </div>
                        <div class="form-group mb-3">
                          <label class="form-label" for="exampleFormControlTextarea1">Textarea</label>
                          <textarea id="exampleFormControlTextarea1" class="form-control" rows="3"></textarea>
                        </div>
                        <div class="form-group mb-3">
                          <label class="form-label" for="exampleFormControlFile1">File input</label>
                          <input id="exampleFormControlFile1" type="file" class="form-control" />
                        </div>
                      </div>
                      <div class="col-xl-6">
                        <div class="form-group mb-3">
                          <label class="form-label" for="exampleFormControlSelect1">Select dropdown</label>
                          <select id="exampleFormControlSelect1" class="form-select">
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                          </select>
                        </div>
                        <div class="form-group mb-3">
                          <label class="form-label" for="exampleFormControlSelect2">Multiple select</label>
                          <select id="exampleFormControlSelect2" multiple class="form-select">
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </form>
                </CardBody>

                <Highlightjs :code="code1" />
              </Card>
            </div>
            <!-- END #formControls -->

            <!-- BEGIN #sizing -->
            <div id="sizing" class="mb-5">
              <h4>Sizing</h4>
              <p>Set heights using classes like <code>.form-control-lg</code> and <code>.form-control-sm</code>.</p>
              <Card>
                <CardBody>
                  <div class="row mb-n3">
                    <div class="col-xl-6">
                      <input class="form-control form-control-lg mb-3" type="text" placeholder=".form-control-lg" />
                      <input class="form-control mb-3" type="text" placeholder="Default input" />
                      <input class="form-control form-control-sm mb-3" type="text" placeholder=".form-control-sm" />
                    </div>
                    <div class="col-xl-6">
                      <select class="form-select form-select-lg mb-3">
                        <option>Large select</option>
                      </select>
                      <select class="form-select mb-3">
                        <option>Default select</option>
                      </select>
                      <select class="form-select form-select-sm mb-3">
                        <option>Small select</option>
                      </select>
                    </div>
                  </div>
                </CardBody>
                <Highlightjs :code="code2" />
              </Card>
            </div>
            <!-- END #sizing -->

            <!-- BEGIN #readonly -->
            <div id="readonly" class="mb-5">
              <h4>Readonly</h4>
              <p>
                Add the readonly boolean attribute on an input to prevent modification of the input’s value. Read-only
                inputs appear lighter (just like disabled inputs), but retain the standard cursor.
              </p>
              <Card>
                <CardBody>
                  <input class="form-control" type="text" placeholder="Readonly input here..." readonly />
                </CardBody>
                <Highlightjs :code="code3" />
              </Card>
            </div>
            <!-- END #readonly -->

            <!-- BEGIN #readonlyPlainText -->
            <div id="readonlyPlainText" class="mb-5">
              <h4>Readonly plain text</h4>
              <p>
                If you want to have <code>&lt;input readonly&gt;</code> elements in your form styled as plain text, use
                the .form-control-plaintext class to remove the default form field styling and preserve the correct
                margin and padding.
              </p>
              <Card>
                <CardBody>
                  <form>
                    <div class="form-group row mb-3">
                      <label for="staticEmail" class="col-sm-2 col-form-label">Email</label>
                      <div class="col-sm-10">
                        <input
                          id="staticEmail"
                          type="text"
                          readonly
                          class="form-control-plaintext"
                          value="email@example.com"
                        />
                      </div>
                    </div>
                    <div class="form-group row mb-2">
                      <label for="inputPassword" class="col-sm-2 col-form-label">Password</label>
                      <div class="col-sm-10">
                        <input id="inputPassword" type="password" class="form-control" />
                      </div>
                    </div>
                  </form>
                </CardBody>
                <Highlightjs :code="code4" />
              </Card>
            </div>
            <!-- END #readonlyPlainText -->

            <!-- BEGIN #rangeInputs -->
            <div id="rangeInputs" class="mb-5">
              <h4>Range inputs</h4>
              <p>Set horizontally scrollable range inputs using <code>.form-range</code>.</p>
              <Card>
                <CardBody>
                  <div class="row mb-n3">
                    <div class="col-xl-6">
                      <div class="form-group mb-3">
                        <label for="formControlRange" class="form-label">Example range input</label>
                        <input id="formControlRange" type="range" class="form-range" />
                      </div>
                    </div>
                    <div class="col-xl-6">
                      <div class="form-group mb-3">
                        <label for="disabledRange" class="form-label">Disabled range</label>
                        <input id="disabledRange" type="range" class="form-range" disabled />
                      </div>
                    </div>
                  </div>
                </CardBody>
                <Highlightjs :code="code5" />
              </Card>
            </div>
            <!-- END #rangeInputs -->

            <!-- BEGIN #checkboxes -->
            <div id="checkboxes" class="mb-5">
              <h4>Checkboxes</h4>
              <p>
                Default checkboxes are improved upon with the help of <code>.form-check</code>, a single class for both
                input types that improves the layout and behavior of their HTML elements.
              </p>
              <Card>
                <CardBody>
                  <div class="row mb-n3">
                    <div class="col-xl-6">
                      <div class="small text-white text-opacity-50 mb-1"><b>DEFAULT CHECKBOX</b></div>
                      <div class="form-group mb-4">
                        <div class="form-check">
                          <input id="defaultCheck1" class="form-check-input" type="checkbox" value="" />
                          <label class="form-check-label" for="defaultCheck1">Default checkbox</label>
                        </div>
                        <div class="form-check">
                          <input id="defaultCheck2" class="form-check-input" type="checkbox" value="" checked />
                          <label class="form-check-label" for="defaultCheck2">Checked checkbox</label>
                        </div>
                        <div class="form-check">
                          <input id="defaultCheck3" class="form-check-input" type="checkbox" value="" disabled />
                          <label class="form-check-label" for="defaultCheck3">Disabled checkbox</label>
                        </div>
                      </div>
                    </div>
                    <div class="col-xl-6">
                      <div class="small text-white text-opacity-50 mb-1"><b>INLINE CHECKBOX</b></div>
                      <div class="form-group mb-3">
                        <div class="form-check form-check-inline">
                          <input id="inlineCheckbox1" class="form-check-input" type="checkbox" value="option1" />
                          <label class="form-check-label" for="inlineCheckbox1">1</label>
                        </div>
                        <div class="form-check form-check-inline">
                          <input
                            id="inlineCheckbox2"
                            class="form-check-input"
                            type="checkbox"
                            value="option2"
                            checked
                          />
                          <label class="form-check-label" for="inlineCheckbox2">2</label>
                        </div>
                        <div class="form-check form-check-inline">
                          <input
                            id="inlineCheckbox3"
                            class="form-check-input"
                            type="checkbox"
                            value="option3"
                            disabled
                          />
                          <label class="form-check-label" for="inlineCheckbox3">3 (disabled)</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
                <Highlightjs :code="code6" />
              </Card>
            </div>
            <!-- END #checkboxes -->

            <!-- BEGIN #radios -->
            <div id="radios" class="mb-5">
              <h4>Radios</h4>
              <p>
                Default radios are improved upon with the help of <code>.form-check</code>, a single class for both
                input types that improves the layout and behavior of their HTML elements. You can use Bootstrap custom
                radio for styled radio button.
              </p>
              <Card>
                <CardBody>
                  <div class="row mb-n3">
                    <div class="col-xl-6">
                      <div class="small text-white text-opacity-50 mb-1"><b>DEFAULT RADIO</b></div>
                      <div class="form-group mb-4">
                        <div class="form-check">
                          <input id="defaultRadio1" class="form-check-input" type="radio" value="" name="radio_1" />
                          <label class="form-check-label" for="defaultRadio1">Default radio button</label>
                        </div>
                        <div class="form-check">
                          <input
                            id="defaultRadio2"
                            class="form-check-input"
                            type="radio"
                            value=""
                            name="radio_1"
                            checked
                          />
                          <label class="form-check-label" for="defaultRadio2">Checked radio button</label>
                        </div>
                        <div class="form-check">
                          <input
                            id="defaultRadio3"
                            class="form-check-input"
                            type="radio"
                            value=""
                            name="radio_1"
                            disabled
                          />
                          <label class="form-check-label" for="defaultRadio3">Disabled radio button</label>
                        </div>
                      </div>
                    </div>
                    <div class="col-xl-6">
                      <div class="small text-white text-opacity-50 mb-1"><b>INLINE RADIO</b></div>
                      <div class="form-group mb-3">
                        <div class="form-check form-check-inline">
                          <input
                            id="inlineRadio1"
                            class="form-check-input"
                            name="default_radio"
                            type="radio"
                            value="option1"
                          />
                          <label class="form-check-label" for="inlineRadio1">1</label>
                        </div>
                        <div class="form-check form-check-inline">
                          <input
                            id="inlineRadio2"
                            class="form-check-input"
                            name="default_radio"
                            type="radio"
                            value="option2"
                            checked
                          />
                          <label class="form-check-label" for="inlineRadio2">2</label>
                        </div>
                        <div class="form-check form-check-inline">
                          <input
                            id="inlineRadio3"
                            class="form-check-input"
                            name="default_radio"
                            type="radio"
                            value="option3"
                            disabled
                          />
                          <label class="form-check-label" for="inlineRadio3">3 (disabled)</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
                <Highlightjs :code="code7" />
              </Card>
            </div>
            <!-- END #radios -->

            <!-- BEGIN #switches -->
            <div id="switches" class="mb-5">
              <h4>Switches</h4>
              <p>
                A switch has the markup of a custom checkbox but uses the <code>.form-switch</code> class to render a
                toggle switch. Switches also support the disabled attribute.
              </p>
              <Card>
                <CardBody>
                  <div class="form-check form-switch">
                    <input id="customSwitch1" type="checkbox" class="form-check-input" />
                    <label class="form-check-label" for="customSwitch1">Toggle this switch element</label>
                  </div>
                  <div class="form-check form-switch">
                    <input id="customSwitch2" type="checkbox" class="form-check-input" checked />
                    <label class="form-check-label" for="customSwitch2">Checked switch element</label>
                  </div>
                  <div class="form-check form-switch">
                    <input id="customSwitch3" type="checkbox" class="form-check-input" disabled />
                    <label class="form-check-label" for="customSwitch3">Disabled switch element</label>
                  </div>
                </CardBody>
                <Highlightjs :code="code8" />
              </Card>
            </div>
            <!-- END #switches -->

            <!-- BEGIN #selectMenu -->
            <div id="selectMenu" class="mb-5">
              <h4>Select menu</h4>
              <p>
                Custom &lt;select&gt; menus need only a custom class, .form-select to trigger the custom styles. Custom
                styles are limited to the &lt;select&gt;’s initial appearance and cannot modify the &lt;option&gt;s due
                to browser limitations.
              </p>
              <Card>
                <CardBody>
                  <div class="row">
                    <div class="col-xl-6">
                      <div class="small text-white text-opacity-50 mb-2"><b>DEFAULT</b></div>
                      <select class="form-select">
                        <option selected>Open this select menu</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </select>
                    </div>
                    <div class="col-xl-6">
                      <div class="small text-white text-opacity-50 mb-2"><b>SIZING</b></div>
                      <select class="form-select form-select-lg mb-3">
                        <option selected>Open this select menu</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </select>

                      <select class="form-select form-select-sm">
                        <option selected>Open this select menu</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </select>
                    </div>
                  </div>
                </CardBody>
                <Highlightjs :code="code9" />
              </Card>
            </div>
            <!-- END #selectMenu -->

            <!-- BEGIN #fileBrowser -->
            <div id="fileBrowser" class="mb-5">
              <h4>File browser</h4>
              <p>
                The file input is the most gnarly of the bunch and requires additional JavaScript if you’d like to hook
                them up with functional Choose file… and selected file name text.
              </p>
              <Card>
                <CardBody>
                  <div class="row">
                    <div class="col-xl-6">
                      <div class="mb-3">
                        <label class="form-label" for="defaultFile">Default file input example</label>
                        <input id="defaultFile" type="file" class="form-control" />
                      </div>
                      <div class="mb-3">
                        <label class="form-label" for="multipleFile">Multiple files input example</label>
                        <input id="multipleFile" type="file" class="form-control" multiple />
                      </div>
                      <div class="mb-3">
                        <label class="form-label" for="disabledFile">Disabled files input example</label>
                        <input id="disabledFile" type="file" class="form-control" disabled />
                      </div>
                    </div>
                    <div class="col-xl-6">
                      <div class="mb-3">
                        <label class="form-label" for="smFile">Small file input example</label>
                        <input id="smFile" type="file" class="form-control form-control-sm" />
                      </div>
                      <div class="mb-3">
                        <label class="form-label" for="lgFile">Large file input example</label>
                        <input id="lgFile" type="file" class="form-control form-control-lg" />
                      </div>
                    </div>
                  </div>
                </CardBody>
                <Highlightjs :code="code10" />
              </Card>
            </div>
            <!-- END #fileBrowser -->

            <!-- BEGIN #formGrid -->
            <div id="formGrid" class="mb-5">
              <h4>Form grid</h4>
              <p>
                More complex forms can be built using bootstrap grid classes. Use these for form layouts that require
                multiple columns, varied widths, and additional alignment options.
              </p>
              <Card>
                <CardBody>
                  <form>
                    <div class="mb-3 row">
                      <label for="inputEmail3" class="col-sm-2 col-form-label">Email</label>
                      <div class="col-sm-10">
                        <input id="inputEmail3" type="email" class="form-control" />
                      </div>
                    </div>
                    <div class="mb-3 row">
                      <label for="inputPassword3" class="col-sm-2 col-form-label">Password</label>
                      <div class="col-sm-10">
                        <input id="inputPassword3" type="password" class="form-control" />
                      </div>
                    </div>
                    <fieldset class="mb-2">
                      <div class="row">
                        <label class="col-form-label col-sm-2 pt-0">Radios</label>
                        <div class="col-sm-10">
                          <div class="form-check">
                            <input
                              id="gridRadios1"
                              class="form-check-input"
                              type="radio"
                              name="gridRadios"
                              value="option1"
                              checked
                            />
                            <label class="form-check-label" for="gridRadios1"> First radio </label>
                          </div>
                          <div class="form-check">
                            <input
                              id="gridRadios2"
                              class="form-check-input"
                              type="radio"
                              name="gridRadios"
                              value="option2"
                            />
                            <label class="form-check-label" for="gridRadios2"> Second radio </label>
                          </div>
                          <div class="form-check disabled">
                            <input
                              id="gridRadios3"
                              class="form-check-input"
                              type="radio"
                              name="gridRadios"
                              value="option3"
                              disabled
                            />
                            <label class="form-check-label" for="gridRadios3"> Third disabled radio </label>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                    <div class="row mb-2">
                      <label class="col-sm-2 col-form-label pt-0">Checkbox</label>
                      <div class="col-sm-10">
                        <div class="form-check">
                          <input id="gridCheck1" class="form-check-input" type="checkbox" />
                          <label class="form-check-label" for="gridCheck1"> Example checkbox </label>
                        </div>
                      </div>
                    </div>
                    <div class="form-group row">
                      <div class="col-sm-10 offset-sm-2">
                        <button type="submit" class="btn btn-outline-theme">Sign in</button>
                      </div>
                    </div>
                  </form>
                </CardBody>
                <Highlightjs :code="code11" />
              </Card>
            </div>
            <!-- END #formGrid -->

            <!-- BEGIN #helpText -->
            <div id="helpText" class="mb-5">
              <h4>Help text</h4>
              <p>
                Block-level help text in forms can be created using <code>.form-text</code>. Inline help text can be
                flexibly implemented using any inline HTML element and utility classes like <code>.text-muted</code>.
              </p>
              <Card>
                <CardBody>
                  <label for="inputPassword5" class="form-label">Password</label>
                  <input
                    id="inputPassword5"
                    type="password"
                    class="form-control"
                    aria-describedby="passwordHelpBlock"
                  />
                  <small id="passwordHelpBlock" class="form-text text-muted">
                    Your password must be 8-20 characters long, contain letters and numbers, and must not contain
                    spaces, special characters, or emoji.
                  </small>
                </CardBody>
                <Highlightjs :code="code12" />
              </Card>
            </div>
            <!-- END #helpText -->

            <!-- BEGIN #inputGroup -->
            <div id="inputGroup" class="mb-5">
              <h4>Input group</h4>
              <p>
                Place one add-on or button on either side of an input. You may also place one on both sides of an input.
                Remember to place <code>&lt;label&gt;</code> outside the input group.
              </p>
              <Card>
                <CardBody>
                  <div class="input-group flex-nowrap">
                    <span id="addon-wrapping" class="input-group-text">@</span>
                    <input type="text" class="form-control" placeholder="Username" />
                    <span class="input-group-text">.com</span>
                  </div>
                </CardBody>
                <Highlightjs :code="code13" />
              </Card>
            </div>
            <!-- END #inputGroup -->

            <!-- BEGIN #validation -->
            <div id="validation" class="mb-5">
              <h4>Validation</h4>
              <p>
                Provide valuable, actionable feedback to your users with HTML5 form validation. Choose from the browser
                default validation feedback, or implement custom messages with our built-in classes and starter
                JavaScript.
              </p>
              <Card>
                <CardBody>
                  <form class="was-validated">
                    <div class="row mb-n3">
                      <div class="col-md-6 mb-3">
                        <label for="validationValidInput" class="form-label">Valid input</label>
                        <input
                          id="validationValidInput"
                          type="text"
                          class="form-control is-valid"
                          value="Mark"
                          required
                        />
                        <div class="valid-feedback">Looks good!</div>
                      </div>
                      <div class="col-md-6 mb-3">
                        <label for="validationInvalidInput" class="form-label">Invalid input</label>
                        <input
                          id="validationInvalidInput"
                          type="text"
                          class="form-control is-invalid"
                          value=""
                          required
                        />
                        <div id="validationInvalidInputFeedback" class="invalid-feedback">Please provide a name</div>
                      </div>
                      <div class="col-md-6 mb-3">
                        <label for="validationInvalidInputGroup" class="form-label">Input group</label>
                        <div class="input-group has-validation">
                          <span class="input-group-text">@</span>
                          <input
                            id="validationInvalidInputGroup"
                            type="text"
                            class="form-control is-invalid"
                            required
                          />
                          <div class="invalid-feedback">Please choose a username.</div>
                        </div>
                      </div>
                      <div class="col-md-6 mb-3">
                        <label for="validationSelectInvalid" class="form-label">Select dropdown</label>
                        <select id="validationSelectInvalid" class="form-select is-invalid" required>
                          <option selected disabled value="">Choose...</option>
                          <option>...</option>
                        </select>
                        <div class="invalid-feedback">Please select a valid state.</div>
                      </div>
                      <div class="col-md-6 mb-3">
                        <label for="validationTextarea" class="form-label">Textarea</label>
                        <textarea
                          id="validationTextarea"
                          class="form-control is-invalid"
                          placeholder="Required example textarea"
                          required
                        ></textarea>
                        <div class="invalid-feedback">Please enter a message in the textarea.</div>
                      </div>
                      <div class="col-md-6 mb-3">
                        <div class="form-check pt-md-3 mt-md-2">
                          <input
                            id="validationInvalidCheckbox"
                            class="form-check-input is-invalid"
                            type="checkbox"
                            value=""
                            required
                          />
                          <label class="form-check-label" for="validationInvalidCheckbox">
                            Agree to terms and conditions
                          </label>
                          <div class="invalid-feedback">You must agree before submitting.</div>
                        </div>
                      </div>
                    </div>
                  </form>
                  <hr />
                  <form class="was-validated" novalidate>
                    <div class="row mb-n3">
                      <div class="col-md-6 mb-5 position-relative">
                        <label for="validationTooltip01">Tooltip valid</label>
                        <input id="validationTooltip01" type="text" class="form-control" value="Mark" required />
                        <div class="valid-tooltip">Looks good!</div>
                      </div>
                      <div class="col-md-6 mb-5 position-relative">
                        <label for="validationTooltip02">Tooltip invalid</label>
                        <div class="input-group">
                          <div class="input-group-text">@</div>
                          <input id="validationTooltip02" type="text" class="form-control" required />
                          <div class="invalid-tooltip">Field is required</div>
                        </div>
                      </div>
                      <div class="col-md-6 mb-5 position-relative">
                        <label for="validationTooltip03">Tooltip dropdown</label>
                        <select id="validationTooltip03" class="form-select" required>
                          <option selected disabled value="">Choose...</option>
                          <option>...</option>
                        </select>
                        <div class="invalid-tooltip">Please select a valid state.</div>
                      </div>
                    </div>
                  </form>
                </CardBody>
                <Highlightjs :code="code14" />
              </Card>
            </div>
            <!-- END #validation -->
          </div>
          <!-- END col-9-->
          <!-- BEGIN col-3 -->
          <div class="col-xl-3">
            <!-- BEGIN #sidebar-bootstrap -->
            <nav id="sidebar-bootstrap" class="navbar navbar-sticky d-none d-xl-block">
              <nav class="nav">
                <NavScrollTo class="nav-link" target="#formControls" data-toggle="scroll-to">Form controls</NavScrollTo>
                <NavScrollTo class="nav-link" target="#sizing" data-toggle="scroll-to">Sizing</NavScrollTo>
                <NavScrollTo class="nav-link" target="#readonly" data-toggle="scroll-to">Readonly</NavScrollTo>
                <NavScrollTo class="nav-link" target="#readonlyPlainText" data-toggle="scroll-to"
                  >Readonly plain text</NavScrollTo
                >
                <NavScrollTo class="nav-link" target="#rangeInputs" data-toggle="scroll-to">Range inputs</NavScrollTo>
                <NavScrollTo class="nav-link" target="#checkboxes" data-toggle="scroll-to">Checkboxes</NavScrollTo>
                <NavScrollTo class="nav-link" target="#radios" data-toggle="scroll-to">Radios</NavScrollTo>
                <NavScrollTo class="nav-link" target="#switches" data-toggle="scroll-to">Switches</NavScrollTo>
                <NavScrollTo class="nav-link" target="#selectMenu" data-toggle="scroll-to">Select menu</NavScrollTo>
                <NavScrollTo class="nav-link" target="#fileBrowser" data-toggle="scroll-to">File browser</NavScrollTo>
                <NavScrollTo class="nav-link" target="#formGrid" data-toggle="scroll-to">Form grid</NavScrollTo>
                <NavScrollTo class="nav-link" target="#helpText" data-toggle="scroll-to">Help text</NavScrollTo>
                <NavScrollTo class="nav-link" target="#inputGroup" data-toggle="scroll-to">Input group</NavScrollTo>
                <NavScrollTo class="nav-link" target="#validation" data-toggle="scroll-to">Validation</NavScrollTo>
              </nav>
            </nav>
            <!-- END #sidebar-bootstrap -->
          </div>
          <!-- END col-3 -->
        </div>
        <!-- END row -->
      </div>
      <!-- END col-10 -->
    </div>
    <!-- END row -->
  </div>
  <!-- END container -->
</template>
