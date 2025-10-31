import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { registrations } from '@/routes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import registrationsAPI from '@/routes/api/registrations';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import UidDisplay from '@/components/ui/uid-display';
import { type BreadcrumbItem } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import axios from 'axios';
import { API_ENDPOINTS } from '@/config';


interface Pagination {
  current_page: number;
 last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

interface Registration {
  id: number;
  name: string;
 email: string;
  birthday: string;
  age: number;
  invited_by: string | null;
  salvationist: string;
  mobile_number: string | null;
  uid: string | null;
  created_at: string;
  is_attended: boolean | number;
}

interface RegistrationsResponse {
  data: Registration[];
  pagination: Pagination;
}

const RegistrationsPage = () => {
 const [registrationsData, setRegistrationsData] = useState<Registration[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
 const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
 const [generatingUids, setGeneratingUids] = useState(false);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
 const [isRegistering, setIsRegistering] = useState(false);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        page: page.toString(),
        per_page: perPage.toString()
      });
      const response = await fetch(
        `${registrationsAPI.index().url}?${params}`
      );
      const data: RegistrationsResponse = await response.json();
      setRegistrationsData(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [search, page, perPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePerPageChange = (value: string) => {
    setPerPage(Number(value));
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (pagination?.last_page || 1)) {
      setPage(newPage);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const breadcrumbs: BreadcrumbItem[] = [
      {
        title: 'Registrations',
        href: registrations().url,
      },
  ];

  const handleRegisterClick = (registration: Registration) => {
    setSelectedRegistration(registration);
    setIsModalOpen(true);
  };

  const handleConfirmRegistration = async () => {
    if (!selectedRegistration) return;

    console.log(API_ENDPOINTS.UPDATE_ATTENDANCE());
    setIsRegistering(true);
    try {
      const response = await axios.post(
        API_ENDPOINTS.UPDATE_ATTENDANCE(),
        { id: selectedRegistration.id },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
        }
      );

      if (response.status === 200) {
        alert('Registration successful! 100 points have been added.');
        setIsModalOpen(false);
        fetchRegistrations(); // Refresh the data
      } else {
        alert('Error: ' + (response.data.message || 'Failed to register'));
      }
    } catch (error) {
      console.error('Error registering:', error);
      if (axios.isAxiosError(error)) {
        alert('Error: ' + (error.response?.data?.message || 'Failed to register'));
      } else {
        alert('Error: Failed to register');
      }
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Registrations" />
      <div className="container mx-auto py-10 p-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Registrations</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2 sm:gap-0">
              <Button
                onClick={handleExportExcel}
                className="bg-green-600 hover:bg-green-700"
              >
                Export to Excel
              </Button>
              <Button
                onClick={handleGenerateUids}
                disabled={generatingUids}
              >
                {generatingUids ? 'Generating...' : 'Generate All UIDs'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
              <Input
                  placeholder="Search registrations..."
                  value={search}
                  onChange={handleSearchChange}
                  className="max-w-md"
              />
              </div>
              <div className="w-32">
              <Select value={perPage.toString()} onValueChange={handlePerPageChange}>
                  <SelectTrigger>
                  <SelectValue placeholder="Per page" />
                  </SelectTrigger>
                  <SelectContent>
                  <SelectItem value="5">5 per page</SelectItem>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                  </SelectContent>
              </Select>
              </div>
          </div>

        <div className="rounded-md border">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Actions</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Birthday</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Invited By</TableHead>
                <TableHead>Mobile Number</TableHead>
                <TableHead>Salvationist</TableHead>
                <TableHead>UID</TableHead>
                <TableHead>Registered At</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                <TableRow>
                    <TableCell colSpan={10}>
                    <div className="flex flex-col gap-2">
                        {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                    </TableCell>
                </TableRow>
                ) : registrationsData.length > 0 ? (
                registrationsData.map((registration) => (
                    <TableRow key={registration.id}>
                    <TableCell>
                      <Button
                        onClick={() => handleRegisterClick(registration)}
                        variant="outline"
                        size="sm"
                        disabled={registration.is_attended == 1}
                      >
                        {registration.is_attended == 1 ? 'Attended' : 'Register'}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{registration.name}</TableCell>
                    <TableCell>{registration.email}</TableCell>
                    <TableCell>{formatDate(registration.birthday)}</TableCell>
                    <TableCell>{registration.age}</TableCell>
                    <TableCell>{registration.invited_by || '-'}</TableCell>
                    <TableCell>{registration.mobile_number || '-'}</TableCell>
                    <TableCell>{registration.salvationist === 'yes' ? 'Yes' : 'No'}</TableCell>
                    <TableCell><UidDisplay uid={registration.uid} /></TableCell>
                    <TableCell>{formatDate(registration.created_at)}</TableCell>
                    </TableRow>
                ))
                ) : (
                <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                    No registrations found
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </div>

        {!loading && pagination && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
            <div className="text-sm text-gray-600">
                Showing {pagination.from} to {pagination.to} of {pagination.total} results
            </div>
            <div className="flex items-center space-x-2">
                <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                >
                Previous
                </Button>

                <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                    let pageNum;
                    if (pagination.last_page <= 5) {
                    pageNum = i + 1;
                    } else if (page <= 3) {
                    pageNum = i + 1;
                    } else if (page >= pagination.last_page - 2) {
                    pageNum = pagination.last_page - 4 + i;
                    } else {
                    pageNum = page - 2 + i;
                    }

                    return (
                    <Button
                        key={pageNum}
                        variant={page === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className={page === pageNum ? "bg-primary" : ""}
                    >
                        {pageNum}
                    </Button>
                    );
                })}
                </div>

                <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= (pagination?.last_page || 1)}
                >
                Next
                </Button>
            </div>
            </div>
        )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Registration</DialogTitle>
            <DialogDescription>
              Are you sure you want to register {selectedRegistration?.name}? This will mark the user as attended and award 100 points.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isRegistering}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmRegistration}
              disabled={isRegistering}
            >
              {isRegistering ? 'Registering...' : 'Confirm Registration'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      </div>
    </AppLayout>
  );

  async function handleGenerateUids() {
    if (!confirm('This will generate UIDs for all registrations that don\'t have one. Continue?')) {
      return;
    }

    setGeneratingUids(true);
    try {
      const response = await fetch(
        registrationsAPI.generateUids().url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        fetchRegistrations();
      } else {
        alert('Error: ' + (result.message || 'Failed to generate UIDs'));
      }
    } catch (error) {
      console.error('Error generating UIDs:', error);
      alert('Error: Failed to generate UIDs');
    } finally {
      setGeneratingUids(false);
    }
 }

  async function handleExportExcel() {
    try {
      window.open(registrationsAPI.export().url, '_blank');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Error: Failed to export data to Excel');
    }
  }
};

export default RegistrationsPage;
