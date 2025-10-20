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
import { type BreadcrumbItem } from '@/types';


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

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Registrations" />
      <div className="container mx-auto py-10 p-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Registrations</CardTitle>
            <Button
              onClick={handleGenerateUids}
              disabled={generatingUids}
            >
              {generatingUids ? 'Generating...' : 'Generate All UIDs'}
            </Button>
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
                    <TableCell colSpan={8}>
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
                    <TableCell className="font-medium">{registration.name}</TableCell>
                    <TableCell>{registration.email}</TableCell>
                    <TableCell>{formatDate(registration.birthday)}</TableCell>
                    <TableCell>{registration.age}</TableCell>
                    <TableCell>{registration.invited_by || '-'}</TableCell>
                    <TableCell>{registration.mobile_number || '-'}</TableCell>
                    <TableCell>{registration.salvationist === 'yes' ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{registration.uid || '-'}</TableCell>
                    <TableCell>{formatDate(registration.created_at)}</TableCell>
                    </TableRow>
                ))
                ) : (
                <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
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
};

export default RegistrationsPage;
