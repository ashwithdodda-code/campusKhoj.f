import React, { useState } from 'react';
import { BookOpen, Layers, Code2, Database, Award, CheckCircle, Shield, FileCode2 } from 'lucide-react';

export const OopArchitectureView: React.FC = () => {
  const [activePillar, setActivePillar] = useState<'ENCAPSULATION' | 'ABSTRACTION' | 'INHERITANCE' | 'POLYMORPHISM'>('ENCAPSULATION');
  const [activeCodeTab, setActiveCodeTab] = useState<'ITEM' | 'LOST_ITEM' | 'MATCHABLE' | 'SERVICE' | 'FILE_HANDLER'>('ITEM');

  return (
    <div className="space-y-8">
      {/* Authors & PPT Course Project Card (Slide 1 & 12) */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="text-xs font-mono text-orange-400 font-bold mb-1">
              JAVA COURSE-BASED PROJECT · PPT ALIGNED SPECIFICATION
            </div>
            <h2 className="text-2xl font-black text-white">Campus Lost and Found Management System</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Engineered to strictly demonstrate all 4 pillars of Object-Oriented Programming,
              12+ Java classes across 5 layered packages, and file serialization persistence (<span className="font-mono text-orange-400">items.dat</span>).
            </p>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center shrink-0">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Project Metric</div>
            <div className="text-xl font-extrabold text-white font-mono">4 Pillars · 12+ Classes</div>
            <div className="text-[10px] text-emerald-400 font-bold">5 Layered Packages</div>
          </div>
        </div>

        {/* Project Authors from Slide 12 */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
            <div className="text-xs font-bold text-white">CH. Shri Varshith</div>
            <div className="text-[11px] font-mono text-orange-400">Roll: 25071A6607</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Admin & Security Lead</div>
          </div>
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
            <div className="text-xs font-bold text-white">P. Dhruva Krishna</div>
            <div className="text-[11px] font-mono text-emerald-400">Roll: 25071A6616</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Staff & Inventory Lead</div>
          </div>
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
            <div className="text-xs font-bold text-white">D. Ashwith</div>
            <div className="text-[11px] font-mono text-blue-400">Roll: 25071A6617</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Architecture & Matching Lead</div>
          </div>
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
            <div className="text-xs font-bold text-white">I. Hansika</div>
            <div className="text-[11px] font-mono text-purple-400">Roll: 25071A6621</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Student Verification Lead</div>
          </div>
        </div>
      </div>

      {/* The 4 OOP Pillars Interactive Section (PPT Slide 8 & 9) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-orange-500" />
            <span>The 4 Core OOP Pillars in CampusKhoj</span>
          </h3>
          <span className="text-xs text-slate-400">Click a pillar to inspect design rationale & code</span>
        </div>

        {/* Pillar Selection Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => setActivePillar('ENCAPSULATION')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              activePillar === 'ENCAPSULATION'
                ? 'bg-slate-900 border-orange-500 shadow-md ring-1 ring-orange-500/20'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="text-[10px] font-mono text-orange-400 font-bold mb-1">PILLAR 01</div>
            <div className="font-bold text-sm text-white">Encapsulation</div>
            <div className="text-[11px] text-slate-400 mt-1">Private fields & validation guards in setters</div>
          </button>

          <button
            onClick={() => setActivePillar('ABSTRACTION')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              activePillar === 'ABSTRACTION'
                ? 'bg-slate-900 border-orange-500 shadow-md ring-1 ring-orange-500/20'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="text-[10px] font-mono text-orange-400 font-bold mb-1">PILLAR 02</div>
            <div className="font-bold text-sm text-white">Abstraction</div>
            <div className="text-[11px] text-slate-400 mt-1">Item & User abstract classes + Matchable interface</div>
          </button>

          <button
            onClick={() => setActivePillar('INHERITANCE')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              activePillar === 'INHERITANCE'
                ? 'bg-slate-900 border-orange-500 shadow-md ring-1 ring-orange-500/20'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="text-[10px] font-mono text-orange-400 font-bold mb-1">PILLAR 03</div>
            <div className="font-bold text-sm text-white">Inheritance</div>
            <div className="text-[11px] text-slate-400 mt-1">LostItem, FoundItem, Student, Staff, Admin hierarchy</div>
          </button>

          <button
            onClick={() => setActivePillar('POLYMORPHISM')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              activePillar === 'POLYMORPHISM'
                ? 'bg-slate-900 border-orange-500 shadow-md ring-1 ring-orange-500/20'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="text-[10px] font-mono text-orange-400 font-bold mb-1">PILLAR 04</div>
            <div className="font-bold text-sm text-white">Polymorphism</div>
            <div className="text-[11px] text-slate-400 mt-1">Method overriding & overloaded search()</div>
          </button>
        </div>

        {/* Selected Pillar Content Box */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
          {activePillar === 'ENCAPSULATION' && (
            <div className="space-y-3">
              <div className="text-xs font-mono text-orange-400 font-bold uppercase">
                PPT Slide 08: Encapsulation Implementation
              </div>
              <h4 className="text-lg font-bold text-white">Data Hiding & Validation Guards</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                All attributes in <code className="text-orange-300 font-mono">Item</code>, <code className="text-orange-300 font-mono">User</code>, and <code className="text-orange-300 font-mono">Claim</code> are strictly declared <code className="text-orange-300 font-mono">private</code>.
                Mutations are performed exclusively through validated setters (e.g. <code className="text-orange-300 font-mono">setName()</code> throws <code className="text-orange-300 font-mono">IllegalArgumentException</code> if an empty string is passed).
              </p>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
{`// Item.java: Encapsulation with validation
private String name;
private Category category;
private ItemStatus status;

public void setName(String name) {
    if (name == null || name.trim().isEmpty()) {
        throw new IllegalArgumentException("Item name cannot be empty");
    }
    this.name = name.trim();
}`}
              </div>
            </div>
          )}

          {activePillar === 'ABSTRACTION' && (
            <div className="space-y-3">
              <div className="text-xs font-mono text-orange-400 font-bold uppercase">
                PPT Slide 08: Abstraction Implementation
              </div>
              <h4 className="text-lg font-bold text-white">Abstract Contracts & Single-Purpose Interfaces</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                <code className="text-orange-300 font-mono">Item</code> and <code className="text-orange-300 font-mono">User</code> are abstract base classes. The rest of the application interacts with "an Item" or "a User" without knowing whether it is a lost calculator, a found smartwatch, or a staff administrator.
                The <code className="text-orange-300 font-mono">Matchable</code> interface exposes auto-matching as a clean single method contract.
              </p>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
{`// Matchable.java & Item.java Abstraction
public interface Matchable {
    int matchScore(Item other);
}

public abstract class Item implements Serializable {
    public abstract String getType();
    public abstract ItemStatus getInitialStatus();
}`}
              </div>
            </div>
          )}

          {activePillar === 'INHERITANCE' && (
            <div className="space-y-3">
              <div className="text-xs font-mono text-orange-400 font-bold uppercase">
                PPT Slide 09: Inheritance Implementation
              </div>
              <h4 className="text-lg font-bold text-white">Hierarchical Code Reuse</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                <code className="text-orange-300 font-mono">LostItem</code> and <code className="text-orange-300 font-mono">FoundItem</code> extend <code className="text-orange-300 font-mono">Item</code>.
                <code className="text-orange-300 font-mono">Student</code>, <code className="text-orange-300 font-mono">Staff</code>, and <code className="text-orange-300 font-mono">Admin</code> extend <code className="text-orange-300 font-mono">User</code>.
                Common attributes such as immutable ID, timestamp, name, and reporting party are written once in the superclass and inherited.
              </p>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
{`// Inheritance Example
public class LostItem extends Item implements Matchable { ... }
public class FoundItem extends Item { 
    private String storageLocation; // Specialized found property
}
public class Admin extends User {
    private int securityClearanceLevel;
}`}
              </div>
            </div>
          )}

          {activePillar === 'POLYMORPHISM' && (
            <div className="space-y-3">
              <div className="text-xs font-mono text-orange-400 font-bold uppercase">
                PPT Slide 09: Polymorphism Implementation
              </div>
              <h4 className="text-lg font-bold text-white">Dynamic Dispatch & Method Overloading</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Runtime Polymorphism (Overriding):</strong> Calling <code className="text-orange-300 font-mono">getAllItems().forEach(System.out::println)</code> executes the specialized <code className="text-orange-300 font-mono">toString()</code> of <code className="text-orange-300 font-mono">LostItem</code> or <code className="text-orange-300 font-mono">FoundItem</code>.
                <br />
                <strong>Compile-Time Polymorphism (Overloading):</strong> <code className="text-orange-300 font-mono">LostFoundService.search()</code> is overloaded with 3 signatures: by keyword, by category, and multi-parameter.
              </p>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
{`// Overloaded Search Polymorphism
public List<Item> search(String keyword) { ... }
public List<Item> search(Category category) { ... }
public List<Item> search(String kw, Category cat, String loc, ItemStatus status, String type) { ... }`}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Package Explorer & Class Structure (PPT Slide 6 & 7) */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="text-xs font-mono text-orange-400 font-bold">5 LAYERED PACKAGES · 12+ CLASSES & TYPES</div>
            <h3 className="text-lg font-bold text-white">Architectural Package Structure</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">com.campuskhoj.*</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
            <div className="text-xs font-bold text-orange-400 font-mono">1. model</div>
            <ul className="text-xs text-slate-300 space-y-1 font-mono text-[11px]">
              <li>• Item «abstract»</li>
              <li>• LostItem</li>
              <li>• FoundItem</li>
              <li>• User «abstract»</li>
              <li>• Student</li>
              <li>• Staff</li>
              <li>• Admin</li>
              <li>• Claim</li>
              <li>• MatchResult</li>
            </ul>
          </div>

          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
            <div className="text-xs font-bold text-emerald-400 font-mono">2. enums & interfaces</div>
            <ul className="text-xs text-slate-300 space-y-1 font-mono text-[11px]">
              <li>• Matchable «interface»</li>
              <li>• Category (Enum)</li>
              <li>• ItemStatus (Enum)</li>
              <li>• ClaimStatus (Enum)</li>
            </ul>
          </div>

          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
            <div className="text-xs font-bold text-blue-400 font-mono">3. service</div>
            <ul className="text-xs text-slate-300 space-y-1 font-mono text-[11px]">
              <li>• LostFoundService</li>
              <li>• MatchingEngine</li>
              <li>• UserService</li>
            </ul>
          </div>

          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
            <div className="text-xs font-bold text-purple-400 font-mono">4. util & exceptions</div>
            <ul className="text-xs text-slate-300 space-y-1 font-mono text-[11px]">
              <li>• FileHandler (items.dat)</li>
              <li>• ItemNotFoundEx</li>
              <li>• InvalidClaimEx</li>
              <li>• UnauthorizedOpEx</li>
            </ul>
          </div>

          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
            <div className="text-xs font-bold text-amber-400 font-mono">5. controllers & config</div>
            <ul className="text-xs text-slate-300 space-y-1 font-mono text-[11px]">
              <li>• AuthController</li>
              <li>• ItemController</li>
              <li>• ClaimController</li>
              <li>• MatchController</li>
              <li>• AdminController</li>
              <li>• SecurityConfig</li>
            </ul>
          </div>
        </div>
      </div>

      {/* File I/O Serialization Inspector (PPT Slide 4, 5, 10, 11) */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <div className="text-xs font-mono text-emerald-400 font-bold">PPT SLIDE 04 & 05 · OBJECT SERIALIZATION</div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>File Persistence Engine (items.dat)</span>
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">File I/O with Object Streams</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          As specified in Slide 4 and 5 of the presentation, CampusKhoj utilizes Java object streams (<code className="text-emerald-400 font-mono">ObjectOutputStream</code> and <code className="text-emerald-400 font-mono">ObjectInputStream</code>)
          to serialize campus accounts, lost/found items, and claims into <code className="text-emerald-400 font-mono">./data/items.dat</code>.
          On server startup, <code className="text-emerald-400 font-mono">FileHandler.loadData()</code> automatically deserializes saved records and synchronizes sequence counters so no data is lost upon server restart.
        </p>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto space-y-2">
          <div className="text-slate-500">// FileHandler.java: Thread-safe ObjectOutputStream Serialization</div>
          <div>{`public synchronized boolean saveData(List<Item> items, List<User> users, List<Claim> claims) {
    CampusDataWrapper wrapper = new CampusDataWrapper(items, users, claims, Item.getCounter(), User.getCounter(), Claim.getCounter());
    try (ObjectOutputStream oos = new ObjectOutputStream(new BufferedOutputStream(new FileOutputStream(filePath)))) {
        oos.writeObject(wrapper);
        oos.flush();
        return true;
    }
}`}</div>
        </div>
      </div>
    </div>
  );
};
