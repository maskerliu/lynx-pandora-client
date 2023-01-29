import { Organization } from '.'
import { RemoteAPI } from './api.const'
import { formPost, get, post } from './base.api'


export namespace OrganizationApi {

  export function getCompany(cid: string) {
    return get<Organization.Company>(RemoteAPI.Organization.BasePath + RemoteAPI.Organization.CompanyInfo, { cid },)
  }

  export function saveCompany(company: Organization.Company) {
    return post<string>(RemoteAPI.Organization.BasePath + RemoteAPI.Organization.CompanySave, company)
  }

  export function getRoles(cid: string) {
    return get<Array<Organization.Role>>(RemoteAPI.Organization.BasePath + RemoteAPI.Organization.RoleAll, { cid },)
  }

  export function saveRole(role: Organization.Role) {
    return post<string>(RemoteAPI.Organization.BasePath + RemoteAPI.Organization.RoleSave, role)
  }

  export function deleteRole(rid: string) {
    let data = new FormData()
    data.append('rid', rid)
    return formPost<string>(RemoteAPI.Organization.BasePath + RemoteAPI.Organization.RoleDelete, data)
  }

  export function getOperators(cid: string, page: number) {
    return get<Array<Organization.Operator>>(RemoteAPI.Organization.BasePath + RemoteAPI.Organization.PagedOperators, { cid, page })
  }

  export function operatorInfo(uid?: string) {
    return get<Array<Organization.Operator>>(RemoteAPI.Organization.BasePath + RemoteAPI.Organization.Operator, { uid })
  }

  export function saveOperator(operator: Organization.Operator) {
    return post<string>(RemoteAPI.Organization.BasePath + RemoteAPI.Organization.OperatorSave, operator)
  }

  export function removeOperator(uid: string) {
    let data = new FormData()
    data.append('uid', uid)
    return formPost<string>(RemoteAPI.Organization.BasePath + RemoteAPI.Organization.OperatorDelete, data)
  }
}