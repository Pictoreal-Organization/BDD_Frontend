import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  User, 
  Mail, 
  Phone, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Info, 
  Check
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().min(10, "Valid mobile number is required"),
  category: z.string().min(1, "Please select a category"),
  rollNo: z.string().regex(/^\d{5}$/, "Roll No. must be exactly 5 digits").optional(),
  age: z.coerce.number().min(18, "Minimum age is 18").max(65, "Maximum age is 65"),
  weight: z.coerce.number().min(45, "Minimum weight is 45kg"),
  bloodGroup: z.string().min(1, "Select blood group"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  agreeTerms: z.boolean().refine(v => v === true, "You must agree to terms"),
  certifyInfo: z.boolean().refine(v => v === true, "You must certify your info"),
});

export default function Register() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      agreeTerms: false,
      certifyInfo: false,
    }
  });

  const category = watch("category");
  const age = watch("age");
  const weight = watch("weight");

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) {
      fieldsToValidate = ["fullName", "email", "mobile", "category"];
      if (category === "Student") fieldsToValidate.push("rollNo");
    } else if (step === 2) {
      fieldsToValidate = ["age", "weight", "bloodGroup"];
    }

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
    setIsSuccessModalOpen(true);
  };

  const steps = [
    { id: 1, name: "Personal" },
    { id: 2, name: "Medical" },
    { id: 3, name: "Account" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      {/* Progress Indicator */}
      <div className="w-full max-w-[600px] mb-8">
        <div className="relative flex justify-between">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-red-600 -translate-y-1/2 z-0 transition-all duration-500" 
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          />
          {steps.map((s) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  step >= s.id ? "bg-red-600 border-red-600 text-white" : "bg-white border-gray-200 text-gray-400"
                )}
              >
                {step > s.id ? <Check className="w-5 h-5" /> : s.id}
              </div>
              <span className={cn(
                "mt-2 text-xs font-medium uppercase tracking-wider",
                step >= s.id ? "text-red-600" : "text-gray-400"
              )}>
                {s.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Card className="w-full max-w-[600px] shadow-xl border-none">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className="space-y-1 bg-gray-50/50 rounded-t-xl border-b border-gray-100">
            <CardTitle className="text-2xl font-display font-bold text-gray-800">
              {step === 1 && "Step 1: Personal Information"}
              {step === 2 && "Step 2: Medical Details"}
              {step === 3 && "Step 3: Create Your Account"}
            </CardTitle>
            <CardDescription>
              Register as Blood Donor - Step {step} of 3
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-8 min-h-[400px]">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input 
                        id="fullName" 
                        placeholder="John Doe" 
                        className="pl-10" 
                        {...register("fullName")}
                      />
                      {!errors.fullName && watch("fullName")?.length > 2 && (
                        <CheckCircle2 className="absolute right-3 top-3 w-4 h-4 text-green-500" />
                      )}
                    </div>
                    {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="john@example.com" 
                        className="pl-10"
                        {...register("email")}
                      />
                    </div>
                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input 
                        id="mobile" 
                        placeholder="+91-XXXXXXXXXX" 
                        className="pl-10"
                        {...register("mobile")}
                      />
                    </div>
                    {errors.mobile && <p className="text-xs text-red-500">{errors.mobile.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select onValueChange={(v) => setValue("category", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Student">Student</SelectItem>
                          <SelectItem value="Faculty">Faculty</SelectItem>
                          <SelectItem value="Staff">Staff</SelectItem>
                          <SelectItem value="External">External</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
                    </div>

                    {category === "Student" && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-2"
                      >
                        <Label htmlFor="rollNo">Roll No.</Label>
                        <Input id="rollNo" placeholder="12345" {...register("rollNo")} />
                        {errors.rollNo && <p className="text-xs text-red-500">{errors.rollNo.message}</p>}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input id="age" type="number" {...register("age")} />
                      {age && (age < 18 || age > 65) && (
                        <p className="text-xs text-red-500 font-medium">Ineligible: Must be 18-65 years</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input id="weight" type="number" {...register("weight")} />
                      {weight && weight < 45 && (
                        <p className="text-xs text-red-500 font-medium">Ineligible: Minimum weight 45kg</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Select onValueChange={(v) => setValue("bloodGroup", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Blood Group" />
                      </SelectTrigger>
                      <SelectContent>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => (
                          <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.bloodGroup && <p className="text-xs text-red-500">{errors.bloodGroup.message}</p>}
                  </div>

                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3">
                    <Info className="w-5 h-5 text-blue-500 shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Eligibility Criteria:</p>
                      <ul className="list-disc list-inside space-y-0.5 opacity-90">
                        <li>Age: 18-65 years</li>
                        <li>Weight: Minimum 45 kg</li>
                        <li>Gap: 3 months between donations</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input id="username" className="pl-10" placeholder="Unique username" {...register("username")} />
                    </div>
                    {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox id="terms" onCheckedChange={(v) => setValue("agreeTerms", !!v)} />
                      <Label htmlFor="terms" className="text-sm font-normal leading-tight">
                        I agree to the <span className="text-red-600 hover:underline cursor-pointer font-medium">terms and conditions</span>
                      </Label>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Checkbox id="certify" onCheckedChange={(v) => setValue("certifyInfo", !!v)} />
                      <Label htmlFor="certify" className="text-sm font-normal leading-tight">
                        I certify that all information provided is accurate and truthful.
                      </Label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>

          <CardFooter className="flex justify-between border-t border-gray-100 bg-gray-50/50 p-6 rounded-b-xl">
            {step === 1 ? (
              <Button type="button" variant="ghost" onClick={() => setLocation("/")}>
                Cancel
              </Button>
            ) : (
              <Button type="button" variant="outline" onClick={prevStep}>
                <ChevronLeft className="w-4 h-4 mr-2" /> Back
              </Button>
            )}

            {step < 3 ? (
              <Button type="button" onClick={nextStep} className="bg-red-600 hover:bg-red-700">
                Next Step <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                type="submit" 
                className="bg-red-600 hover:bg-red-700 px-8"
                disabled={!isValid}
              >
                Complete Registration
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>

      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="sm:max-w-md text-center py-10">
          <DialogHeader>
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900">Registration Successful!</DialogTitle>
            <DialogDescription className="text-lg pt-4">
              Thank you for registering! Your registration is pending review by our admin team.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center mt-6">
            <Button 
              type="button" 
              className="bg-red-600 hover:bg-red-700 w-full sm:w-auto px-12 h-12 rounded-full"
              onClick={() => setLocation("/")}
            >
              Go to Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}