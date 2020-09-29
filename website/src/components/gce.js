import React, { useState } from "react"
import { graphql, useStaticQuery } from "gatsby"
import { Formik, Field, Form } from "formik"

import styles from "../styles/gce.module.scss"

const calculate = (data, setter, values) => {
  const {
    daysPerMonth,
    hoursPerDay,
    machineFamily,
    machineType,
    memory,
    schedulingType,
    vcpus
  } = values

  try {
    const prices = data.dataYaml.gcp_prices.gce.vm_instances[machineFamily]
    const vcpuUnitPrice = prices[machineType]["vcpu"]["prices"][schedulingType]
    const memUnitPrice = prices[machineType]["memory"]["prices"][schedulingType]

    const vcpuPrice = vcpuUnitPrice * vcpus * hoursPerDay * daysPerMonth
    const memPrice = memUnitPrice * memory * hoursPerDay * daysPerMonth
    const total = vcpuPrice + memPrice

    setter({
      vcpuUnitPrice,
      memUnitPrice,
      memPrice,
      vcpuPrice,
      total
    })

  } catch (err) {
    console.log(err)
  }

}

function GCECalculator() {
  const data = useStaticQuery(graphql`
    query {
      dataYaml {
        gcp_prices {
          gce {
            vm_instances {
              general {
                e2 {
                  desc
                  memory {
                    unit
                    prices {
                      ondemand
                      preempt
                      reserve3
                      reserve1
                    }
                  }
                  vcpu {
                    unit
                    prices {
                      ondemand
                      preempt
                      reserve1
                      reserve3
                    }
                    max
                  }
                }
                n2 {
                  vcpu {
                    unit
                    prices {
                      ondemand
                      reserve3
                      preempt
                      reserve1
                    }
                  }
                  desc
                  memory {
                    unit
                    prices {
                      preempt
                      ondemand
                      reserve1
                      reserve3
                    }
                  }
                }
                n2d {
                  desc
                  memory {
                    unit
                    prices {
                      ondemand
                      preempt
                      reserve1
                      reserve3
                    }
                  }
                  vcpu {
                    prices {
                      ondemand
                      preempt
                      reserve1
                      reserve3
                    }
                    unit
                  }
                }
              }
            }
          }
        }
      }
    }
  `)

  const form = (
    <Formik
      initialValues={{
        machineFamily: "general",
        machineType: "e2",
        schedulingType: "ondemand",
        vcpus: 0,
        memory: 0,
        hoursPerDay: 0,
        daysPerMonth: 0,
      }}
      validate={(values) => calculate(data, setCosts, values)}
    >
      {props => (

        <Form className={styles.pricingForm}>
          <div className={styles.formItem}>
            <label htmlFor="machineFamily">Machine family</label>
            <Field name="machineFamily" as="select">
              <option value="general">General purpose</option>
              <option value="shared">Shared core</option>
            </Field>
          </div>

          <div className={styles.formItem}>
            <label htmlFor="machineType">Machine type</label>
            {
              (props.values.machineFamily === "general") && 
              <Field name="machineType" as="select">
                  <option value="e2">E2</option>
                  <option value="n2">N2</option>
                  <option value="n2d">N2D</option>
              </Field>
            }
            {
              (props.values.machineFamily === "shared") && 
              <Field name="machineType" as="select">
                  <option value="e2">E2</option>
                  <option value="n1">N1</option>
              </Field>
            }
          </div>

          <div className={styles.formItem}>
            <label htmlFor="schedulingType">Scheduling type</label>
            <Field name="schedulingType" as="select">
              <option value="ondemand">On demand</option>
              <option value="preempt">Preemptible</option>
              <option value="reserve1">1 year committed use</option>
              <option value="reserve3">3 year committed use</option>
            </Field>
          </div>

          <div className={styles.formItem}>
            <label htmlFor="vcpus">vCPUs</label>
            <Field name="vcpus" placeholder="0" />
          </div>

          <div className={styles.formItem}>
            <label htmlFor="memory">Memory</label>
            <Field name="memory" placeholder="0" />
          </div>

          <div className={styles.formItem}>
            <label htmlFor="hoursPerDay">Hours per day</label>
            <Field name="hoursPerDay" placeholder="0" />
          </div>

          <div className={styles.formItem}>
            <label htmlFor="daysPerMonth">Days per month</label>
            <Field name="daysPerMonth" placeholder="0" />
          </div>
        </Form>
      )}
    </Formik>
  )

  const [costs, setCosts] = useState({})

  return (
    <div>
      {form}

      <div>
        <p>{JSON.stringify(costs)}</p>
      </div>
    </div>
  )
}

export default GCECalculator
