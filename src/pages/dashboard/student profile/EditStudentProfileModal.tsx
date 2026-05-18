/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  useLazyGetMeQuery,
  useUpdateProfileMutation,
} from "@/store/features/auth/auth.api";
import { useAppDispatch } from "@/hooks/useRedux";
import { setUser, selectToken } from "@/store/features/auth/auth.slice";
import { useSelector } from "react-redux";
import { examOptions } from "@/pages/authPage/constants";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export default function EditStudentProfileModal({ open, setOpen, user }: any) {
  const dispatch = useAppDispatch();
  const accessToken = useSelector(selectToken);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [getMe] = useLazyGetMeQuery();

  const [firstName, setFirstName] = useState(user.profile?.firstName || "");
  const [phone, setPhone] = useState<string | undefined>();
  const [lastName, setLastName] = useState(user.profile?.lastName || "");
  const [university, setUniversity] = useState(user.profile?.university || "");
  const [country, setCountry] = useState(user.profile?.country || "");
  const [yearOfStudy, setYearOfStudy] = useState(
    user.profile?.year_of_study || ""
  );
  const [studentType, setStudentType] = useState(
    user.profile?.studentType || ""
  );
  const [preparingFor, setPreparingFor] = useState<any>(
    user.profile?.preparingFor || ""
  );
  const [bio, setBio] = useState(user.profile?.bio || "");

  useEffect(() => {
    if (!open || !user) return;

    setFirstName(user.profile?.firstName || "");
    setLastName(user.profile?.lastName || "");
    setUniversity(user.profile?.university || "");
    setCountry(user.profile?.country || "");
    setYearOfStudy(user.profile?.year_of_study || "");
    setStudentType(user.profile?.studentType || "");
    setPreparingFor(user.profile?.preparingFor || "");
    setBio(user.profile?.bio || "");
  }, [open, user]);

  const handleSubmit = async () => {
    try {
      if (!firstName || !lastName || !country || !university || !yearOfStudy) {
        toast.error("Please fill all required fields");
        return;
      }

      const profileData: any = {
        firstName,
        phone,
        lastName,
        country,
        bio,
        university,
        year_of_study: yearOfStudy,
        studentType,
        preparingFor: Array.isArray(preparingFor)
          ? preparingFor
          : (preparingFor || "")
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean)
              .map((name: string) => {
                const option = examOptions.find(
                  (opt: any) =>
                    opt.examName.toLowerCase() === name.toLowerCase()
                );
                return {
                  examName: option?.examName || name,
                  description: option?.description || name,
                };
              }),
      };

      if (user?.profile?.preference) {
        profileData.preference = {
          subject: user.profile.preference.subject,
          systemPreference: user.profile.preference.systemPreference,
          topic: user.profile.preference.topic,
          subTopic: user.profile.preference.subTopic,
        };
      }

      const formDataToSend = new FormData();
      formDataToSend.append("data", JSON.stringify(profileData));

      const res = await updateProfile(formDataToSend).unwrap();

      if (res.success) {
        const meRes = await getMe(undefined, false).unwrap();

        dispatch(
          setUser({
            accessToken: accessToken || "",
            user: meRes?.data,
          })
        );
      }

      setOpen(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to update profile");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserRound /> Profile Information
          </DialogTitle>
          <DialogDescription>
            Update your profile information below
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="grid gap-2">
            <Label>First Name</Label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
            />
          </div>

          <div className="grid gap-2">
            <Label>Last Name</Label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
            />
          </div>

          <div className="grid gap-2">
            <Label>Country</Label>
            <Input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Bangladesh"
            />
          </div>

          <div className="grid gap-2">
            <Label>Mobile No</Label>
            <PhoneInput
              placeholder="Enter phone number"
              value={phone}
              onChange={setPhone}
              defaultCountry="IN"
            />
          </div>

          <div className="grid gap-2">
            <Label>University</Label>
            <Input
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="National University"
            />
          </div>

          <div className="grid gap-2">
            <Label>Year of Study</Label>
            <Input
              value={yearOfStudy}
              onChange={(e) => setYearOfStudy(e.target.value)}
              placeholder="4th Year"
            />
          </div>

          <div className="grid gap-2">
            <Label>Student Type</Label>
            <Input
              value={studentType}
              onChange={(e) => setStudentType(e.target.value)}
              placeholder="Undergraduate"
            />
          </div>

          <div className="grid gap-2">
            <Label>Preparing For</Label>
            <Input
              value={
                Array.isArray(preparingFor)
                  ? preparingFor
                      .map(
                        (item: { examName: string; description: string }) =>
                          item.examName
                      )
                      .join(", ")
                  : preparingFor || ""
              }
              onChange={(e) => setPreparingFor(e.target.value)}
              placeholder="e.g. USMLE Step 1, NCLEX"
            />
          </div>

          <div className="grid col-span-2 gap-2">
            <Label>Bio</Label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={6}
              placeholder={bio}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            onClick={handleSubmit}
            className="bg-blue-main hover:bg-blue-600 text-white cursor-pointer"
          >
            {isLoading ? "Updating..." : "Update Profile"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}