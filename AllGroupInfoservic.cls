public with sharing class AllGroupInfoservice {
    @AuraEnabled(cacheable=true)
    public static List<Group> fetchAllGroups(){
        return [SELECT Id, DeveloperName FROM Group order order by CreatedDate desc limit 5  ];
    }
     @AuraEnabled(cacheable=true)
    public static List<user> fetchAllUsers(string ids){
        set<id> groupUsers=new set<id>();
        list<user> Alluserlist=new list<user>();
        list<GroupMember> grpmember=[select UserOrGroupId from GroupMember where groupid =:ids];
        for(GroupMember grp:grpmember){
            groupUsers.add(grp.UserOrGroupId); 
        }
          system.debug('groupUsers'+groupUsers);
        list<user> u=[select id,name,email from user where id IN:groupUsers]
            ;
            for(user obj:u){
                Alluserlist.add(obj);
            }
      return Alluserlist;
    }
}