import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const managerRoleGuard: CanActivateFn = () => {
  const router = inject(Router);
  const role = localStorage.getItem('role');

  if (role === 'admin' || role === 'manager') return true;

  router.navigate(['/admin-home/EmployeeDashboard']);
  return false;
};
